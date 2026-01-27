/**
 * Application Configuration Constants
 */

export const APP_CONFIG = {
    name: 'TAO',
    subtitle: 'The Way of Love2D',
    version: '1.0.0',
    author: 'TAO Engine',
} as const

export const PATHS = {
    taoDir: 'tao',
    talksDir: 'tao/talks',
    motionsDir: 'tao/motions',
    configFile: 'tao/tao_config.json',
    generatedTalks: 'src/generated/talks',
    generatedMotions: 'src/generated/motions',
} as const

export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'zh'] as const

export const FILE_EXTENSIONS = {
    json: '.json',
    lua: '.lua',
    image: ['.png', '.jpg', '.jpeg', '.gif'],
} as const
