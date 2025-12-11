# ServerByte Deployment Guide for RAGA BY MALLIKA

## Step-by-Step Deployment Instructions

### Prerequisites
- ServerByte hosting account with cPanel access
- Domain: ragabymallika.in (already configured)
- FTP/File Manager access
- Your Supabase credentials

---

## Part 1: Prepare Your Files

### 1. Build the Application
The production files are ready in the `dist` folder. If you need to rebuild:
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 2. Files to Upload
You need to upload these files from the `dist` folder:
- `index.html`
- `assets/` (entire folder with all CSS and JS files)
- `images/` (if any static images)

---

## Part 2: Upload to ServerByte

### Option A: Using cPanel File Manager (Recommended)

1. **Login to cPanel**
   - Go to your ServerByte cPanel dashboard
   - Navigate to **File Manager**

2. **Navigate to Web Root**
   - Go to `public_html` folder (or `www` or `httpdocs` depending on your setup)
   - If your domain is in a subdirectory, navigate there

3. **Upload Files**
   - Click **Upload** button
   - Select all files from your `dist` folder
   - Upload `index.html` to the root
   - Upload the entire `assets` folder
   - Upload `.htaccess` file (see below)

### Option B: Using FTP Client (FileZilla)

1. **Get FTP Credentials from cPanel**
   - In cPanel, go to **FTP Accounts**
   - Create an FTP account if needed
   - Note: hostname, username, password

2. **Connect with FileZilla**
   - Host: ftp.ragabymallika.in (or provided hostname)
   - Username: your FTP username
   - Password: your FTP password
   - Port: 21

3. **Upload Files**
   - Navigate to `public_html` in the remote site
   - Drag and drop all files from `dist` folder

---

## Part 3: Configure URL Rewriting

### Create .htaccess File

Create a `.htaccess` file in your web root with this content:

```apache
# Enable URL Rewriting
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## Part 4: Environment Configuration

### Important: Set Up Environment Variables

Your application needs Supabase credentials. You have two options:

#### Option 1: Update Before Build (Recommended)
1. Edit `.env` file locally with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```
2. Run `npm run build` again
3. Upload the new build

#### Option 2: Use cPanel Environment Variables
Some hosting setups support environment variables through cPanel, but since Vite builds static files, Option 1 is better.

---

## Part 5: Domain Configuration

### Verify Domain Settings

1. **Check DNS Records**
   - A Record: Should point to your ServerByte IP address
   - Wait 24-48 hours for DNS propagation (if just changed)

2. **SSL Certificate**
   - In cPanel, go to **SSL/TLS Status**
   - Enable AutoSSL for ragabymallika.in
   - Wait for certificate to be issued (5-10 minutes)
   - Your site will be accessible via https://

3. **Force HTTPS**
   Add this to the top of your `.htaccess`:
   ```apache
   # Force HTTPS
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## Part 6: Testing

### Test Your Deployment

1. **Visit Your Website**
   - Go to https://ragabymallika.in
   - Check if the homepage loads

2. **Test Navigation**
   - Click on different pages
   - Check if URLs work correctly
   - Test back button

3. **Test Features**
   - User login (Google sign-in)
   - Product browsing
   - Cart functionality
   - Admin panel access

4. **Mobile Testing**
   - Open on mobile devices
   - Check responsiveness
   - Test all features on mobile

---

## Common Issues & Solutions

### Issue 1: 404 Errors on Page Refresh
**Solution:** Make sure `.htaccess` is uploaded and mod_rewrite is enabled

### Issue 2: White Screen
**Solution:**
- Check browser console for errors
- Verify all files uploaded correctly
- Check file permissions (644 for files, 755 for folders)

### Issue 3: Images Not Loading
**Solution:**
- Verify `assets` folder uploaded completely
- Check image paths in code
- Ensure file names match exactly (case-sensitive)

### Issue 4: Supabase Connection Errors
**Solution:**
- Verify `.env` variables were included in build
- Check Supabase dashboard for correct URLs
- Verify Supabase project is active

### Issue 5: SSL Not Working
**Solution:**
- Wait for AutoSSL to complete (check cPanel SSL/TLS Status)
- Contact ServerByte support if needed
- Temporarily remove HTTPS redirect from .htaccess

---

## ServerByte Support

If you encounter hosting-specific issues:
- **Support Portal:** Check ServerByte's client area
- **Live Chat:** Available on their website
- **Email Support:** Usually provided in your welcome email
- **Knowledge Base:** Check their documentation

---

## Post-Deployment Checklist

- [ ] Website loads at https://ragabymallika.in
- [ ] All pages accessible
- [ ] Images loading correctly
- [ ] Google login working
- [ ] Product pages functional
- [ ] Cart system working
- [ ] Admin panel accessible
- [ ] Razorpay payments configured
- [ ] WhatsApp links working
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Performance optimized

---

## Maintenance

### Updating Your Site

When you need to update the website:
1. Make changes locally
2. Run `npm run build`
3. Upload only changed files from `dist` folder
4. Clear browser cache to see changes

### Backup Strategy
- Regularly backup your database from Supabase dashboard
- Keep a local copy of your source code
- ServerByte may offer automated backups in cPanel

---

## Performance Optimization

Your site is already optimized with:
- Minified CSS and JavaScript
- Gzip compression (via .htaccess)
- Browser caching enabled
- Optimized images
- CDN-ready assets

For further optimization:
- Consider Cloudflare for CDN
- Enable additional caching in cPanel
- Optimize images further if needed

---

**Ready to go live!** 🚀

If you need help with any step, contact ServerByte support or refer to this guide.
