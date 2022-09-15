
export const isDevelopment = import.meta.env.MODE === "development";


export const is = {
    macos: process.platform === 'darwin',
    linux: process.platform === 'linux',
    windows: process.platform === 'win32',
    main: process.type === 'browser',
    renderer: process.type === 'renderer',
    development: process.env.NODE_ENV === 'development',
    macAppStore: process.mas === true,
    windowsStore: process.windowsStore === true,
};

type PlatformMapping = { 'macos': any, 'windows': any, 'linux': any, 'default'?: any }
/**
 * Get platform-specific values
 * 
 * Example:
 * const dir = platform({
    macos: 'Mac',
    windows: 'Windows',
    linux: 'Linux',
  });
 *
 * @param mapping object that maps 'macos', 'windows' and 'linux' to values.
 * @returns values in platform mapping
 */
export const platform = (mapping: PlatformMapping) => {
    const platform = is.macos ? 'macos' : is.windows ? 'windows' : 'linux';
    const fn = platform in mapping ? mapping[platform] : mapping.default;
    return typeof fn === 'function' ? fn() : fn;
};