import typia from "typia";
export const check = (input: any): input is string | null => {
    return "string" === typeof input;
};
