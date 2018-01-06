var YamahaAPI = require('yamaha-nodejs');

YamahaAPI.prototype.set7chMode = function(to){
	var command = '<YAMAHA_AV cmd="PUT"><Main_Zone><Surround><Program_Sel><Current><Sound_Program>7ch Stereo</Sound_Program></Current></Program_Sel></Surround></Main_Zone></YAMAHA_AV>';
	return this.SendXMLToReceiver(command);
};

var yamaha = new YamahaAPI("192.168.1.56");
module.exports = yamaha;