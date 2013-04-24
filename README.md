nathanbroslawsky.com
=========

The idea behind this site is that the contents can be entirely maintained through Dropbox (on an Ubuntu server, specifically). Here's what we need:

* a Linux installation of dropbox: https://www.dropbox.com/install?os=lnx
* an Upstart configuration file to start the daemon: https://github.com/zzolo/dropbox-upstart/blob/master/dropbox.conf
* a new Dropbox account specifically for the site content. If you already have a Dropbox account, you can share a folder from your new account with your existing account, and manage your files there.
* the binary `inotifywait`: `sudo apt-get install inotify-tools`
* folders in your Dropbox instance that map to sections on your site. These will be explicitely referenced.

Config File (/etc/nathanbroslawsky.com/config.json)
--------------------------------------------

```javascript
{
	"emailuser" : "address@gmail.com",
	"emailpass" : "gmailPassword",
	"sessionkey" : "some_session_secret_key"
}
```
