export class SqlToJsonModel<T extends { [key: string]: any }> {
    rows: [
        T
    ]
}
