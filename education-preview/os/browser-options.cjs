const channel=process.env.PORTAL_BROWSER_CHANNEL||(process.platform==='win32'?'msedge':null);
module.exports={headless:true,...(channel?{channel}:{})};
