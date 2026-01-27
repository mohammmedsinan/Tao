/**
 * Dialog Service
 * Abstracts native dialog operations with browser fallback
 */

const isElectron = () => typeof window !== 'undefined' && !!window.electronAPI

export const dialogService = {
    /**
     * Open a folder picker dialog
     */
    async openFolder(): Promise<string | null> {
        if (!isElectron()) {
            console.warn('[dialogService] Browser mode: folder picker not available')
            return null
        }
        return window.electronAPI.openFolder()
    },

    /**
     * Open an image picker dialog
     */
    async openImage(): Promise<string | null> {
        if (!isElectron()) {
            console.warn('[dialogService] Browser mode: image picker not available')
            return null
        }
        return window.electronAPI.openImage()
    }
}
