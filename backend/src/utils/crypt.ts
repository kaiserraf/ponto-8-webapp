import crypto from 'crypto';
import bcrypt from 'bcrypt';

const getKey = async () => {
    const keyHex = process.env.ENCRYPTION_KEY;
    if(!keyHex) throw new Error("ENCRYPTION_KEY não definido");
    const key = Buffer.from(keyHex, 'hex');
    if(key.length != 32) throw new Error("ENCRYPTION_KEY precisa ter 32 bytes");
    return key;
}

export const encrypt = async (data:string):Promise<string> => {
    const key = await getKey();
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
    
    const authTag = cipher.getAuthTag();

    const concatString = `${iv.toString('base64')}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;

    return concatString;
};

export const decrypt = async (payload:string) => {
    const key = await getKey();

    const [ivB64, authTagB64, encryptedB64] = payload.split(':');

    if(!ivB64 || !authTagB64 || !encryptedB64) throw new Error("Formato invalido");

    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const encrypted = Buffer.from(encryptedB64, 'base64');

    if(authTag.length != 16) throw new Error("Auth Tag invalido");

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString("utf8");
}

export const hashPassword = async (password:string) => {
    const randomSalt = crypto.randomInt(10, 12);
    const hash = await bcrypt.hash(password, randomSalt);
    return hash;
}

export const comparePassword = async (password:string, hash:string) => {
    const compare = await bcrypt.compare(password, hash);
    return compare;
}