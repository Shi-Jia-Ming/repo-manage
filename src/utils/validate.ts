/**
 * @description: 验证网址是否为有效URL
 * @param path {string} 网址
 */
export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
}