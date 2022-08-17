import { FileUpload } from 'graphql-upload';
import { IFileUpload } from '@app/common/model/file-upload.interface';

type gqlFileUploadConvertType = {
    (fileUpload: FileUpload): Promise<IFileUpload>
    (fileUpload: FileUpload[]): Promise<IFileUpload[]>
}

// @ts-ignore
const gqlFileUploadConvert: gqlFileUploadConvertType = async (fileUpload) => {
    if (Array.isArray(fileUpload)) {
        return Promise.all(
            fileUpload.map(async file => {
                const stream = file.createReadStream();
                // @ts-ignore
                const chunks = [];

                await new Promise<Buffer>((resolve, reject) => {
                    let bufferData;

                    stream.on('data', (chunk) => {
                        chunks.push(chunk);
                    });

                    stream.on('end', () => {
                        // @ts-ignore
                        bufferData = Buffer.concat(chunks);
                        resolve(bufferData);
                    });

                    stream.on('error', reject);
                });

                // @ts-ignore
                const buffer = Buffer.concat(chunks);

                return {
                    filename: file.filename,
                    mimetype: file.mimetype,
                    encoding: file.encoding,
                    buffer
                }
            })
        );
    } else {
        console.log(fileUpload.createReadStream);
        const stream = fileUpload.createReadStream();
        // @ts-ignore
        const chunks = [];

        await new Promise<Buffer>((resolve, reject) => {
            let bufferData;

            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            stream.on('end', () => {
                // @ts-ignore
                bufferData = Buffer.concat(chunks);
                resolve(bufferData);
            });

            stream.on('error', reject);
        });

        // @ts-ignore
        const buffer = Buffer.concat(chunks);

        return {
            filename: fileUpload.filename,
            mimetype: fileUpload.mimetype,
            encoding: fileUpload.encoding,
            buffer,
        }
    }
}

export default gqlFileUploadConvert;
