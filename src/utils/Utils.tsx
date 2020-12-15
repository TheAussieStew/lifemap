export const testPrint = (fn: Function, obj: unknown) => {
    console.log(fn.name + '() =>', '\n', obj)
};