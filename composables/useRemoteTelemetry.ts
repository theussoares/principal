import type { RemoteLoadEvent } from '~/types/remote-config'

/**
 * Composable for tracking remote module loading performance.
 * Logs structured telemetry events for observability (Notion spec §5.5).
 *
 * Currently logs to console in structured JSON format.
 * Can be extended to ship to an observability backend (Datadog, Sentry, etc).
 */
export function useRemoteTelemetry() {
    /**
     * Log a successful remote module load.
     */
    function logRemoteLoad(
        remote: string,
        version: string,
        component: string,
        loadTimeMs: number,
    ) {
        const event: RemoteLoadEvent = {
            remote,
            version,
            component,
            loadTimeMs: Math.round(loadTimeMs),
            success: true,
            timestamp: new Date().toISOString(),
        }
        console.info('[MF:Telemetry]', JSON.stringify(event))
    }

    /**
     * Log a failed remote module load.
     */
    function logRemoteError(
        remote: string,
        version: string,
        component: string,
        error: unknown,
    ) {
        const event: RemoteLoadEvent = {
            remote,
            version,
            component,
            loadTimeMs: -1,
            success: false,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
        }
        console.error('[MF:Telemetry]', JSON.stringify(event))
    }

    /**
     * Wraps a dynamic import with performance tracking.
     * Use this around defineAsyncComponent imports.
     *
     * @example
     * const BaseCard = defineAsyncComponent(() =>
     *   trackedImport('design_system', '1.0.0', 'BaseCard', () => import('design_system/BaseCard'))
     * )
     */
    async function trackedImport<T>(
        remote: string,
        version: string,
        component: string,
        importFn: () => Promise<T>,
    ): Promise<T> {
        const start = performance.now()
        try {
            const mod = await importFn()
            const elapsed = performance.now() - start
            logRemoteLoad(remote, version, component, elapsed)
            return mod
        } catch (err) {
            logRemoteError(remote, version, component, err)
            throw err
        }
    }

    return {
        logRemoteLoad,
        logRemoteError,
        trackedImport,
    }
}
