# License <Badge type="tip" text="Since v1.2.0" />

The **License** tab, found under **ProductBay → Settings**, is the control center for your ProductBay Pro subscription.

Depending on your active plugin, this tab displays different content:

## Free Version

If you are using the free version of ProductBay, this tab serves as an overview of what **ProductBay Pro** unlocks. It shows:
- A promotional view highlighting premium features (like Custom Fields, Combined Columns, and Advanced Variable Modes).
- A quick link to upgrade to the Pro version.

## Pro Version 

Once you install and activate the Pro version, this tab transforms into your license management center. It allows you to:
- Enter and activate your license key to unlock the Pro features.
- View your current license status (Active, Expired, Invalid).
- Check your license expiration dates.
- Manage site activations (useful if you are changing URLs or migrating from staging to live).

---

## Activating Your License

To gain access to premium features, fast support, and automatic updates directly from your WordPress dashboard, you must activate your license key.

### Finding Your License Key

After [purchasing ProductBay Pro](https://wpanchorbay.com/plugins/productbay/), your license key will be available in two places:
1. **Purchase Email:** The confirmation email sent to the address you provided during checkout.
2. **Account Dashboard:** Log in to your account on [WPAnchorBay](https://wpanchorbay.com/my-account/) and navigate to the **Licenses** tab.

### Activation Steps

To activate your license and enable Pro features:

1. In your WordPress admin, go to **ProductBay → Settings**.
2. Click on the **License** tab.
3. Paste your license key into the input field.
4. Click the **Activate License** button.

Once successfully activated, the status will change to "License Active" and display the expiration date.

## License Status Indicators

Your license tab will display one of the following statuses:

- **Active:** Your license is valid, and you have full access to features and updates.
- **Expired:** Your subscription has ended. You'll lose access to automatic updates and premium support, but the plugin will continue to function.
- **Invalid / Deactivated:** The key is incorrect or has been deactivated from this site.

## Deactivating and Moving a License

If you want to migrate your license to a new website (e.g., moving from a staging environment to production):
1. Go to **ProductBay → Settings → License** on the old site.
2. Click the **Deactivate License** button.
3. You can now use that key to activate the plugin on your new site.

Alternatively, you can manage your site activations directly from your WPAnchorBay account dashboard.

## Automatic and Manual Updates

**Automatic Updates:** 
ProductBay Pro integrates seamlessly with the standard WordPress update system. Whenever a new version is released, you will see an update notification on the **Plugins** page, provided your license is active.

**Manual Updates:**
If you prefer not to use automatic updates or your license has expired:
1. Download the latest `productbay-pro.zip` from your WPAnchorBay account.
2. Upload the zip in WordPress via **Plugins → Add New → Upload Plugin**.
3. Overwrite the existing plugin when prompted.

## Troubleshooting

- **Firewall Blocking License Server:** Ensure your hosting environment doesn't block outgoing connections to the WPAnchorBay license server. This is required to validate the key.
- **Domain Mismatch:** Once you activate your license, your domain is locked to that license. So you can't use the same license key on two different domains. If you change your domain name, you may need to contact us to reactivate the license key on new domain.
- **Grace Period:** If our license server is temporarily unreachable, ProductBay Pro includes a 3-day offline grace period. Pro features will continue to work during this time while it retries the connection.
- **"Requires ProductBay Free Version" Notice:** ProductBay Pro requires the free version of ProductBay (v1.2.0 or higher) to be active simultaneously. Please install and activate the free version of ProductBay to use ProductBay Pro.
