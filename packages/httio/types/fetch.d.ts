export type QueryParams = {
  [key: string]:
    | Array<QueryParams | boolean | number | string>
    | QueryParams
    | boolean
    | number
    | string
    | null
    | undefined;
};

export declare interface Fetcher {
  (input: Request): Promise<Response>;
}
