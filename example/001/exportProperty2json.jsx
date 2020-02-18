//alert("jsx");

var fps = 60;
var secByFrame = 1/60; //1フレームごとの秒数
var finishSec = 3;// アニメ０ション終了の秒数
var positions = [];
var objectBase = {
  width:100,
  height:100
}
var scales = [];
var anchors = [];
var rotations = [];
var myLayer = app.project.item(1).layer(1);
var refPosition= myLayer.transform.position;
var refScale = myLayer.transform.scale;
var refAnchor = myLayer.transform.anchorPoint;
var refRotationX = myLayer.rotationX;
var refRotationY = myLayer.rotationY;
var refRotationZ = myLayer.rotationZ;

for(var time = 0;time<finishSec;time+=secByFrame){
    var xy = refPosition.valueAtTime(time, true);
    xy[0] = Math.round(xy[0]*100)/100;
    xy[1] = Math.round(xy[1]*100)/100;
    var scaleXY = refScale.valueAtTime(time, true);
    var anchorXY = refAnchor.valueAtTime(time,true);
    var rotationXYZ = [refRotationX.valueAtTime(time,true),refRotationY.valueAtTime(time,true),refRotationZ.valueAtTime(time,true)]
    positions.push(xy);
    scales.push(scaleXY);
    anchors.push(anchorXY);
    rotations.push(rotationXYZ);
}

var startPosition = positions[0];
var adjustPosition = [];
var startAnchor = anchors[0];
var diffPosition = [];
var diffAnchor = [];
for(var i = 0;i<positions.length;i++){
    var xy = [positions[i][0]-startPosition[0],positions[i][1]-startPosition[1]];
    var anchorXY = [anchors[i][0] - startAnchor[0],anchors[i][1] - startAnchor[1]];
    var adjustXY = [xy[0]-anchorXY[0]/100*objectBase.width,xy[1]-anchorXY[1]/100*objectBase.height];
    diffPosition.push(xy);
    diffAnchor.push(anchorXY);
    adjustPosition.push(adjustXY)
    scales[i] = [scales[i][0]/100,scales[i][1]/100];
 }
var outputObject = {};
outputObject["position"] = diffPosition;
outputObject["adjustPosition"] = adjustPosition;
outputObject["scale"] = scales;
outputObject["anchor"] = anchors;
outputObject["rotation"] = rotations;

//キーフレームを打っているものはいつの値を取得するかを指定しないといけない
 // returns an array of 2 or 3 [x,y,z]
var file = File.saveDialog("保存するファイル名を入れてください");
if(file){
  var str = "var motion = "+JSON.stringify(outputObject);
  file.open("w");
  file.encoding = "UTF-8";
  file.lineFeed = "Unix";
  file.write(str);
  file.close();
  alert("jsonを出力しました。");
}