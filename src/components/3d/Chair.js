// src/Components/Scene3d.js

// Import our dependancies
import React, { Component } from "react";
import { TweenMax, Power2 } from "gsap";
// Destructuring really helps clean up babylon projects
import {
  Scene,
  Engine,
  AssetsManager,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Color3,
  Tools,
  MeshBuilder,
  Texture,
  StandardMaterial,
  Axis
} from "babylonjs";
// Here we extend Reacts component class
class Scene3d extends Component {
  colors = {
    red: new Color3(0.5137, 0, 0),
    blue: new Color3(0, 0, 0.5137),
    green: new Color3(0, 0.5137, 0),
    yellow: new Color3(0.5137, 0.5137, 0),
    black: new Color3(0, 0, 0),
    white: new Color3(1, 1, 1),
    grey: new Color3(0.5, 0.5, 0.5)
  };
  /*
   * We add an object which contains a hash table
   * of our regions. These nested objects
   * contain the coordinates we will move
   * the camera to if there key is
   * selected. As well as an id
   * to select individual meshs
   */
  regions = {
    noha: {
      id: "Cylinder00",
      alpha: 8.303185307179586,
      beta: 1.7407963267948966,
      radius: 20
    },
    kriz: {
      id: "Object009",
      alpha: 8.120744722271127,
      beta: 1.5851213529780364,
      radius: 20
    },
    podsedak: {
      id: "Object011",
      alpha: 8.049944373409927,
      beta: 1.2457505434456517,
      radius: 20
    },
    operadlo: {
      id: "Plane003",
      alpha: 8.088007193438249,
      beta: 1.302441018904849,
      radius: 20
    }
  };

  constructor(props) {
    super(props);
    // We bind our events to keep the proper "this" context.
    this.moveCamera = this.moveCamera.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }
  /*
   *  This function animates the movement of
   *  the camera to our new region.
   */
  moveCamera = (e) => {
    TweenMax.to(this.camera, 1, {
      radius: this.regions[e.detail].radius,
      alpha: this.regions[e.detail].alpha,
      beta: this.regions[e.detail].beta,
      ease: Power2.easeOut
    });
  };

  changeColor = (e) => {
    let mesh = this.scene.getMeshByID(this.regions[e.detail.meshName].id);
    mesh.material = mesh.material.clone();
    TweenMax.to(mesh.material.diffuseColor, 1, {
      r: this.colors[e.detail.color].r,
      g: this.colors[e.detail.color].g,
      b: this.colors[e.detail.color].b
    });
  };
  // Makes the canvas behave responsively
  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
      this.scene.debugLayer.show();
    }
  };
  // Sets up our canvas tag for webGL scene
  setEngine = () => {
    this.stage.style.width = "200%";
    this.stage.style.height = "200%";
    this.engine = new Engine(this.stage);
    this.stage.style.width = "100%";
    this.stage.style.height = "100%";
  };
  // Creates the scene graph
  setScene = () => {
    this.scene = new Scene(this.engine);
    /* 
      By default scenes have a blue background here we set 
      it to a cool gray color
    */

    this.scene.clearColor = new Color3(0.9, 0.9, 0.92);
  };
  /* 
     Adds camera to our scene. A scene needs a camera for anything to
     be visible. Also sets up rotation Controls
  */
  setCamera = () => {
    this.camera = new ArcRotateCamera(
      "Camera",
      Math.PI * 2,
      Tools.ToRadians(70),
      0,
      new Vector3(3, 8, 2),
      this.scene
    );
    this.camera.attachControl(this.stage, true);
    this.camera.lowerRadiusLimit = 20;
    this.camera.upperRadiusLimit = 50;
    this.camera.lowerBetaLimit = this.camera.beta - Tools.ToRadians(80);
    this.camera.upperBetaLimit = this.camera.beta + Tools.ToRadians(20);
    this.camera.lowerAlphaLimit = this.camera.alpha - Tools.ToRadians(180);
    this.camera.upperAlphaLimit = this.camera.alpha + Tools.ToRadians(180);
  };

  loadModels = () => {
    /*
     * the AssetManager class is responsible
     * for loading files
     */

    let loader = new AssetsManager(this.scene);
    // Arguments: "ID", "Root URL", "URL Prefix", "Filename"
    let loadBikeModel = loader.addMeshTask("chair", "", "", "../chair001.babylon");
    /*
     *  Loader is given a callback to run when the model has loaded
     *  the variable t is our imported scene. You can use
     *  it to examine all the mesh's loaded.
     */

    loadBikeModel.onSuccess = (t) => {
      this.scene.getMeshByID("Cylinder00").material = this.scene
        .getMeshByID("Cylinder00")
        .material.clone();
      this.scene.getMeshByID("Object009").material = this.scene
        .getMeshByID("Object009")
        .material.clone();
      this.scene.getMeshByID("Object011").material = this.scene
        .getMeshByID("Object011")
        .material.clone();
      this.scene.getMeshByID("Plane003").material = this.scene
        .getMeshByID("Plane003")
        .material.clone();

      this.scene.getMeshByID("Cylinder00").material.diffuseColor = this.colors[
        "white"
      ];
      this.scene.getMeshByID("Object009").material.diffuseColor = this.colors[
        "white"
      ];
      this.scene.getMeshByID("Object011").material.diffuseColor = this.colors[
        "red"
      ];
      this.scene.getMeshByID("Plane003").material.diffuseColor = this.colors[
        "white"
      ];

      // Start the animation loop once the model is loaded
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
      // The model came in a little dark so lets add some extra light
      new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
    };
    // It also calls an Error callback if something goes wrong
    loadBikeModel.onError = function (task, message, exception) {
      console.log(message, exception);
    };
    // We return the fully configured loader
    return loader;
  };

  loadLogo() {
    let url = "../pxslogo.png";
    var materialPlane = new StandardMaterial("logo", this.scene);
    materialPlane.diffuseTexture = new Texture(url, this.scene);
    materialPlane.diffuseTexture.hasAlpha = true;
    materialPlane.specularColor = new Color3(0, 0, 0);

    let logo = MeshBuilder.CreatePlane(
      "logo",
      { width: 470 / 20, height: 440 / 20 },
      this.scene,
      true
    );
    logo.position = new Vector3(0, 0, 0);
    logo.rotate(Axis.X, Math.PI / 2);
    logo.material = materialPlane;
  }

  //Build the scene when the component has been loaded.
  componentDidMount() {
    this.setEngine();
    this.setScene();
    this.setCamera();
    this.loadLogo();
    /*
     *  the loader we return has a load method
     *  attached that will initiate everything.
     */
    this.loadModels().load();
    window.addEventListener("resize", this.onResizeWindow);
    // We can add our custom events just like any other DOM event
    window.addEventListener("move-camera", this.moveCamera);
    window.addEventListener("change-color", this.changeColor);
  }
  //Renderes our Canvas tag and saves a reference to it.
  render() {
    return <canvas className="scene" ref={(el) => (this.stage = el)}></canvas>;
  }
}

//returns the scene to be used by other components
export default Scene3d;
