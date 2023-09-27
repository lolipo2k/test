import {Multer} from 'multer';
import {Readable} from 'stream';

export enum FileType {
    IMAGES = "images",
    FILE = "file",
    PDF = "pdf",
    AUDIO = "audio",
    VIDEO = "video",
    DOCS = "docs",
    DIRECTORY = "directory",
}

export enum FileTypeData {
    // Изоображения
    'image/gif' = FileType.IMAGES,
    'image/jpeg' = FileType.IMAGES,
    'image/pjpeg' = FileType.IMAGES,
    'image/png' = FileType.IMAGES,
    'image/svg+xml' = FileType.IMAGES,
    'image/tiff' = FileType.IMAGES,
    'image/vnd.microsoft.icon'= FileType.IMAGES,
    'image/vnd.wap.wbmp'= FileType.IMAGES,
    'image/webp'= FileType.IMAGES,
    // Аудио записи
    'audio/basic'= FileType.AUDIO,
    'audio/L24'= FileType.AUDIO,
    'audio/mp4'= FileType.AUDIO,
    'audio/aac'= FileType.AUDIO,
    'audio/mpeg'= FileType.AUDIO,
    'audio/ogg='= FileType.AUDIO,
    'audio/vorbis'= FileType.AUDIO,
    'audio/x-ms-wma'= FileType.AUDIO,
    'audio/x-ms-wax'= FileType.AUDIO,
    'audio/vnd.rn-realaudio'= FileType.AUDIO,
    'audio/vnd.wave'= FileType.AUDIO,
    'audio/webm'= FileType.AUDIO,
    // Видео файл
    'video/mpeg' = FileType.VIDEO,
    'video/ogg' = FileType.VIDEO,
    'video/quicktime'= FileType.VIDEO,
    'video/webm'= FileType.VIDEO,
    'video/x-ms-wmv'= FileType.VIDEO,
    'video/x-flv='= FileType.VIDEO,
    'video/x-msvideo'= FileType.VIDEO,
    'video/3gpp'= FileType.VIDEO,
    'video/3gpp2'= FileType.VIDEO,

    'application/pdf' = FileType.PDF,
    //Microsoft
    'text/csv' = FileType.DOCS,
    'application/msword' = FileType.DOCS,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' = FileType.DOCS,
    'application/vnd.ms-excel' = FileType.DOCS,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' = FileType.DOCS,
    'application/vnd.ms-excel.sheet.macroEnabled.12' = FileType.DOCS,
    'application/vnd.ms-powerpoint' = FileType.DOCS,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation' = FileType.DOCS,

}

export interface MainFile {
    /** Name of the form field associated with this file. */
    fieldname: string;
    /** Name of the file on the uploader's computer. */
    originalname: string;
    /**
     * Value of the `Content-Transfer-Encoding` header for this file.
     * @deprecated since July 2015
     * @see RFC 7578, Section 4.7
     */
    encoding: string;
    /** Value of the `Content-Type` header for this file. */
    mimetype: string;
    /** Size of the file in bytes. */
    size: number;
    /**
     * A readable stream of this file. Only available to the `_handleFile`
     * callback for custom `StorageEngine`s.
     */
    stream: Readable;
    /** `DiskStorage` only: Directory to which this file has been uploaded. */
    destination: string;
    /** `DiskStorage` only: Name of this file within `destination`. */
    filename: string;
    /** `DiskStorage` only: Full path to the uploaded file. */
    path: string;
    /** `MemoryStorage` only: A Buffer containing the entire file. */
    buffer: Buffer;
}

export interface RequestFile {
    /** `Multer.File` object populated by `single()` middleware. */
    file?: MainFile | undefined;
    /**
     * Array or dictionary of `Multer.File` object populated by `array()`,
     * `fields()`, and `any()` middleware.
     */
    files?: {
        [fieldname: string]: MainFile[];
    } | MainFile[] | undefined;
}

