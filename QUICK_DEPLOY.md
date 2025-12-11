# Quick Deployment Checklist for ServerByte

## Before You Start
- [ ] You have ServerByte cPanel login credentials
- [ ] Domain ragabymallika.in is pointing to your ServerByte server
- [ ] You have your Supabase credentials ready

---

## Step 1: Prepare Files (Done!)
✅ Production build is ready in `dist` folder
✅ `.htaccess` file is included for URL routing
✅ All assets are optimized

---

## Step 2: Upload to ServerByte

### Using cPanel File Manager (Easiest):

1. **Login to cPanel**
   - Go to your ServerByte control panel
   - Open **File Manager**

2. **Navigate to public_html**
   - This is your website root folder
   - If empty, you're good to go
   - If it has files, you may want to backup first

3. **Upload ALL files from `dist` folder**
   - Click **Upload** button
   - Select all files from `dist` folder:
     - `index.html`
     - `.htaccess`
     - `assets/` folder (entire folder)
   - Wait for upload to complete

4. **Set Permissions**
   - Files: 644
   - Folders: 755
   - (Usually set automatically)

---

## Step 3: Enable SSL (HTTPS)

1. **In cPanel, find "SSL/TLS Status"**
2. **Enable AutoSSL** for ragabymallika.in
3. **Wait 5-10 minutes** for certificate to be issued
4. **Test:** Visit https://ragabymallika.in

---

## Step 4: Test Your Website

Visit https://ragabymallika.in and check:

- [ ] Homepage loads correctly
- [ ] Can navigate to different pages
- [ ] Refresh button works (no 404 errors)
- [ ] Images are loading
- [ ] Products page displays items
- [ ] Cart functionality works
- [ ] Login redirects properly
- [ ] Mobile view is responsive

---

## Step 5: Configure Admin Access

1. **Test Admin Login**
   - Go to https://ragabymallika.in/login
   - Use admin credentials from README
   - Verify admin panel access

2. **Update Admin Password** (recommended)
   - Change default admin password for security

---

## Troubleshooting

### Problem: 404 Error on Page Refresh
**Solution:** Check if `.htaccess` file is uploaded to public_html

### Problem: White/Blank Screen
**Solution:**
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Check Supabase credentials

### Problem: Images Not Loading
**Solution:**
- Verify `assets` folder uploaded completely
- Check file permissions

### Problem: HTTPS Not Working
**Solution:**
- Wait for SSL certificate (can take up to 24 hours)
- Contact ServerByte support
- Remove HTTPS redirect from .htaccess temporarily

---

## Quick File Upload via FTP (Alternative)

If cPanel is not available:

1. **Get FTP Credentials**
   - From ServerByte control panel
   - Host: usually ftp.ragabymallika.in
   - Username and password provided by host

2. **Use FileZilla (Free FTP Client)**
   - Download: https://filezilla-project.org/
   - Connect using credentials
   - Navigate to `public_html`
   - Upload all `dist` folder contents

---

## After Successful Deployment

1. **Test on Multiple Devices**
   - Desktop browsers (Chrome, Firefox, Safari)
   - Mobile devices (iOS, Android)
   - Different screen sizes

2. **Share Your Website**
   - https://ragabymallika.in is live!
   - Test all features thoroughly
   - Share with customers

3. **Monitor Performance**
   - Check loading speed
   - Test payment flows
   - Verify order notifications

---

## Support Contacts

- **ServerByte Support:** Check your welcome email
- **Supabase Issues:** https://supabase.com/support
- **Razorpay Support:** For payment issues

---

## What's Included in Your Deployment

✅ Full ecommerce functionality
✅ Supabase database integration
✅ User authentication (Google sign-in)
✅ Product management
✅ Shopping cart
✅ Razorpay payment gateway
✅ WhatsApp integration
✅ Admin panel
✅ Mobile responsive design
✅ SEO optimized
✅ Security headers
✅ SSL ready
✅ Performance optimized

---

**Your website is production-ready!** 🚀

Just upload the `dist` folder contents and you're live!
