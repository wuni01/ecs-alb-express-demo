'use strict';

const express = require('express');
const os = require('os');

const app = express();

const PORT = Number(process.env.PORT || 80);
const APP_VERSION = process.env.APP_VERSION || 'v1';

function getPrivateIp() {
    const interfaces = os.networkInterfaces();

    for (const addresses of Object.values(interfaces)) {
        for (const address of addresses || []) {
            if (
                address.family === 'IPv4' &&
                !address.internal
            ) {
                return address.address;
            }
        }
    }

    return 'UNKNOWN';
}

// ALB 상태 검사
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        version: APP_VERSION
    });
});

// 메인 웹 페이지
app.get('/', (req, res) => {
    const hostname = os.hostname();
    const privateIp = getPrivateIp();

    res.type('html').send(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>AWS ECS CI/CD Demo</title>

    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(
                135deg,
                #0f172a,
                #1d4ed8
            );
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .content {
            text-align: center;
            padding: 50px;
        }

        h1 {
            font-size: 44px;
        }

        .version {
            font-size: 30px;
            color: #86efac;
            font-weight: bold;
        }

        p {
            font-size: 19px;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>AWS ECS Fargate</h1>

        <div class="version">
            CI/CD Deployment ${APP_VERSION}
        </div>

        <p>Hostname: ${hostname}</p>
        <p>Private IP: ${privateIp}</p>

        <p>
            CodePipeline + CodeBuild + ECR + ECS + ALB
        </p>
    </div>
</body>
</html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(
        `Express ${APP_VERSION} listening on port ${PORT}`
    );
});
