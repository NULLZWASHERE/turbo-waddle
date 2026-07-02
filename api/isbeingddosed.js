// Global tracking array (wipes on serverless cold starts, but ideal for real-time bursts)
let requestLog = [];

export default async function handler(req, res) {
    const now = Date.now();
    
    // 1. Log the current incoming request data
    const requestSize = parseInt(req.headers['content-length'] || '0', 10);
    requestLog.push({ timestamp: now, size: requestSize });

    // 2. Clean up logs older than 10 seconds to keep memory fresh
    requestLog = requestLog.filter(item => now - item.timestamp < 10000);

    // 3. Calculate metrics
    const totalRequestsInWindow = requestLog.length;
    const totalBytesInWindow = requestLog.reduce((acc, item) => acc + item.size, 0);
    const avgPayloadSize = totalRequestsInWindow > 0 ? Math.round(totalBytesInWindow / totalRequestsInWindow) : 0;
    
    // Estimate requests per second (RPS) over our 10-second window
    const requestsPerSecond = (totalRequestsInWindow / 10).toFixed(1);

    // 4. Return telemetry to the frontend
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow cross-origin testing if needed
    res.status(200).json({
        success: true,
        metrics: {
            window_seconds: 10,
            total_requests_tracked: totalRequestsInWindow,
            requests_per_second: parseFloat(requestsPerSecond),
            average_payload_size_bytes: avgPayloadSize,
            total_bandwidth_bytes: totalBytesInWindow
        },
        server_timestamp: now
    });
}
