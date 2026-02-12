/**
 * Remote configuration types for versioned Module Federation.
 * Supports dynamic version resolution and telemetry.
 */

/** Configuration for a single remote module */
export interface RemoteConfig {
    /** Remote name (e.g. 'design_system', 'havy') */
    name: string
    /** Base URL of the remote CDN (e.g. 'https://mf-desing-system.vercel.app') */
    baseUrl: string
    /** Semantic version (e.g. '1.0.0') or 'latest' */
    version: string
}

/** Telemetry event for remote module loading */
export interface RemoteLoadEvent {
    /** Remote name */
    remote: string
    /** Version that was loaded */
    version: string
    /** Component name that was imported */
    component: string
    /** Load time in milliseconds */
    loadTimeMs: number
    /** Whether the load was successful */
    success: boolean
    /** Error message if load failed */
    error?: string
    /** ISO timestamp */
    timestamp: string
}

/** Version manifest returned by an API or config */
export interface VersionManifest {
    remotes: Record<string, {
        version: string
        baseUrl: string
    }>
}
