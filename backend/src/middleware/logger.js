// Custom logging middleware for all routes
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip } = req;

  // Capture the original send function
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    const timestamp = new Date().toISOString();

    console.log(
      `${timestamp} | ${method.padEnd(6)} | ${statusColor}${statusCode}${reset} | ${duration.toString().padEnd(4)}ms | ${ip.padEnd(15)} | ${url}`
    );

    // Call the original send function
    return originalSend.call(this, data);
  };

  next();
};

// Alternative: More detailed logging with request/response body
export const detailedLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip, headers, body } = req;
  const timestamp = new Date().toISOString();

  console.log(`\n[${timestamp}] ==== REQUEST ====`);
  console.log(`Method: ${method}`);
  console.log(`URL: ${url}`);
  console.log(`IP: ${ip}`);
  console.log(`Headers:`, headers);
  if (Object.keys(body || {}).length > 0) {
    console.log(`Body:`, body);
  }

  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    console.log(`\n[${timestamp}] ==== RESPONSE ====`);
    console.log(`Status: ${statusCode}`);
    console.log(`Duration: ${duration}ms`);
    if (data) {
      try {
        console.log(`Response:`, JSON.parse(data));
      } catch {
        console.log(`Response:`, data);
      }
    }
    console.log(`================\n`);

    return originalSend.call(this, data);
  };

  next();
};
