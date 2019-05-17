
var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;

var mesh2;

var controlsOn = false;

function webGLStart(){
	initialize();
	animate();
}

function initialize()
{
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
	
	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})
	markerRoot2 = new THREE.Group();
	scene.add(markerRoot2);
	let markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {
		type: 'pattern', patternUrl: "data/kanji.patt",
	})

	//mesh = doBox();

	//markerRoot1.add( mesh );

	//mesh2= doBall();

	//markerRoot2.add(mesh2);

	mesh3 = doVideo();
	 
	markerRoot1.add( mesh3 );


	meshT = doText();

	markerRoot2.add ( meshT);
	
}

function doPokeBall(){
	let geometry1	= new THREE.SphereGeometry(1,10,10);
	let material1	= new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	
	mesh = new THREE.Mesh( geometry1, material1 );
	mesh.position.y = 0.5;
	return mesh;
}

function doBox(){
	let geometry1	= new THREE.CubeGeometry(1,1,1);
	let material1	= new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	
	mesh = new THREE.Mesh( geometry1, material1 );
	return mesh;
}

function doBall(){
	let geometry2	= new THREE.SphereGeometry(5,32,32);
	let material2	= new THREE.MeshNormalMaterial({
		transparent: false,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	
	mesh2 = new THREE.Mesh( geometry2, material2 );
	mesh2.position.y = -10;
	return mesh2;
}

function doVideo(){
	
	let geometry3 = new THREE.SphereBufferGeometry( 1, 50, 50 );

	let video = document.getElementById( 'video' );
	let texture = new THREE.VideoTexture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;
	let material3 = new THREE.MeshBasicMaterial( { map: texture , side: THREE.DoubleSide} );
	
	mesh3 = new THREE.Mesh( geometry3, material3 );
	mesh3.rotation.x = -Math.PI/2;

	return mesh3;
}

function doHole(){
	// the inside of the hole
	let geometry1	= new THREE.CubeGeometry(2,2,2);
	let loader = new THREE.TextureLoader();
	let texture = loader.load( 'images/tiles.jpg' );
	let material1	= new THREE.MeshLambertMaterial({
		transparent : true,
		map: texture,
		side: THREE.BackSide
	}); 
	
	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y = -1;
	
	markerRoot1.add( mesh1 );
	
	// the invisibility cloak (box with a hole)
	let geometry0 = new THREE.BoxGeometry(2,2,2);
	geometry0.faces.splice(4, 2); // make hole by removing top two triangles
	
	let material0 = new THREE.MeshBasicMaterial({
		colorWrite: false
	});
	
	let mesh0 = new THREE.Mesh( geometry0, material0 );
	mesh0.scale.set(1,1,1).multiplyScalar(1.01);
	mesh0.position.y = -1;
	
	return mesh0;
}

function doCorazon(){

	var x = 0, y = 0;

var heartShape = new THREE.Shape();

heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

var geometry4 = new THREE.ShapeBufferGeometry( heartShape );
var material4 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var mesh4 = new THREE.Mesh( geometry4, material4 ) ;
scene.add( mesh4 );
	return mesh4;
}

function doText()
{
	var geometryT = new THREE.TorusKnotBufferGeometry( 10, 3, 30, 16 );
	var materialT = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('images/Toroide.jpg') } );
	
	meshT = new THREE.Mesh( geometryT, materialT );
	meshT.scale.x = -0.1;
	meshT.scale.y = -0.1;
	meshT.scale.z = -0.1;
	meshT.rotation
	return meshT;
	
}

function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
	
	if (markerRoot1.visible){
		let obj = markerRoot1.children[0];
		obj.rotation.y += 0.035;
		obj.position.y = (obj.position.y <= 1 ) ? obj.position.y += 0.1 : obj.position.y;
		controlsOn = true;
	}else{
		constrolsOn = false;
	}

	if (markerRoot2.visible){
		let obj = markerRoot2.children[0];
		obj.scale.x += 0.035;
		obj.rotation.y += 0.035;
		obj.position.y = (obj.position.y <= 1 ) ? obj.position.y += 0.5 : obj.position.y;
		controlsOn = true;
	}else{
		constrolsOn = false;
	}
}


function render()
{
	renderer.render( scene, camera );
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}