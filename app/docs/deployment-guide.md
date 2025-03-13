# NoamX Arena Deployment Guide

## Overview

This guide provides instructions for deploying the NoamX Arena platform to a production environment. It covers environment setup, configuration, security considerations, and monitoring.

## Prerequisites

Before deployment, ensure you have:

- Node.js 18.x or later
- PostgreSQL 14.x or later
- A domain name for the application
- SSL certificate for secure HTTPS connections
- API keys for the AI model providers you want to support
- Cloud hosting account (Vercel, AWS, Google Cloud, etc.)

## Environment Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/noamx_arena"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"

# Email (for email authentication)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@your-domain.com"

# AI API Keys (optional defaults)
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"
MISTRAL_API_KEY="your-mistral-api-key"
COHERE_API_KEY="your-cohere-api-key"

# Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"
SENTRY_DSN="your-sentry-dsn"
```

### Database Setup

1. Create a PostgreSQL database for the application:

```sql
CREATE DATABASE noamx_arena;
CREATE USER noamx_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE noamx_arena TO noamx_user;
```

2. Run database migrations:

```bash
npx prisma migrate deploy
```

3. Seed the database with initial data (optional):

```bash
npx prisma db seed
```

## Build and Deployment

### Local Build

To build the application locally:

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Deployment Options

#### Vercel (Recommended)

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy the application:

```bash
vercel --prod
```

3. Configure environment variables in the Vercel dashboard.

#### Docker Deployment

1. Build the Docker image:

```bash
docker build -t noamx-arena .
```

2. Run the container:

```bash
docker run -p 3000:3000 --env-file .env noamx-arena
```

#### Traditional Hosting

1. Upload the build files to your server
2. Install dependencies:

```bash
npm install --production
```

3. Start the application:

```bash
npm start
```

## Security Configuration

### SSL/TLS Setup

Ensure your domain has a valid SSL certificate. If using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Other security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Firewall Configuration

Configure your firewall to allow only necessary traffic:

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
```

### Rate Limiting

The application includes built-in rate limiting, but you can add additional protection at the server level:

```nginx
# In your Nginx configuration
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        # ...
        
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3000;
            # ...
        }
    }
}
```

## Monitoring and Analytics

### Setup Monitoring

1. Create a Sentry.io account and add your DSN to the environment variables
2. Set up server monitoring with a tool like PM2:

```bash
npm install -g pm2
pm2 start npm --name "noamx-arena" -- start
pm2 save
pm2 startup
```

3. Configure log rotation:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Analytics Integration

1. Set up Google Analytics or a privacy-focused alternative like Plausible
2. Add your analytics ID to the environment variables
3. Monitor user behavior and performance metrics through the analytics dashboard

## Backup Strategy

### Database Backups

Set up automated PostgreSQL backups:

```bash
# Create a backup script
cat > /usr/local/bin/backup-noamx.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/path/to/backups"
FILENAME="noamx_arena_$TIMESTAMP.sql"

# Create backup
pg_dump -U noamx_user noamx_arena > "$BACKUP_DIR/$FILENAME"

# Compress backup
gzip "$BACKUP_DIR/$FILENAME"

# Remove backups older than 30 days
find "$BACKUP_DIR" -name "noamx_arena_*.sql.gz" -mtime +30 -delete
EOF

# Make it executable
chmod +x /usr/local/bin/backup-noamx.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-noamx.sh") | crontab -
```

### File Backups

Set up regular backups of uploaded files and configuration:

```bash
rsync -avz --delete /path/to/noamx-arena/uploads/ /path/to/backup/uploads/
```

## Scaling Considerations

### Horizontal Scaling

For high-traffic deployments:

1. Use a load balancer to distribute traffic across multiple application instances
2. Configure session storage to use Redis instead of the default:

```js
// In your NextAuth configuration
export default NextAuth({
  // ...
  session: {
    strategy: "jwt",
    store: {
      type: "redis",
      options: {
        url: process.env.REDIS_URL,
      }
    }
  }
});
```

3. Consider using a CDN for static assets

### Database Scaling

For large databases:

1. Implement read replicas for query-heavy operations
2. Consider database sharding for very large datasets
3. Use connection pooling to manage database connections efficiently

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Check your DATABASE_URL and ensure the database server is accessible from your application server
2. **OAuth Authentication Failures**: Verify your OAuth provider credentials and ensure the redirect URIs are correctly configured
3. **Performance Issues**: Check server resources, implement caching, and optimize database queries
4. **Memory Leaks**: Monitor memory usage and restart the application if necessary

### Logs and Diagnostics

Access logs for troubleshooting:

```bash
# Application logs
pm2 logs noamx-arena

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx
```

## Maintenance

### Updates and Patches

To update the application:

1. Pull the latest changes:

```bash
git pull origin main
```

2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
npx prisma migrate deploy
```

4. Rebuild the application:

```bash
npm run build
```

5. Restart the application:

```bash
pm2 restart noamx-arena
```

### Health Checks

Implement regular health checks to ensure the application is running properly:

```bash
# Create a health check script
cat > /usr/local/bin/check-noamx.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://your-domain.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
  echo "Health check failed with status $RESPONSE"
  # Send alert (email, SMS, etc.)
  # Restart application if necessary
  pm2 restart noamx-arena
fi
EOF

# Make it executable
chmod +x /usr/local/bin/check-noamx.sh

# Add to crontab (every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/check-noamx.sh") | crontab -
```

## Support and Resources

For additional support:

- GitHub repository: [github.com/noamx/arena](https://github.com/noamx/arena)
- Documentation: [docs.noamx-arena.com](https://docs.noamx-arena.com)
- Community forum: [community.noamx-arena.com](https://community.noamx-arena.com)
- Email support: [support@noamx-arena.com](mailto:support@noamx-arena.com)
