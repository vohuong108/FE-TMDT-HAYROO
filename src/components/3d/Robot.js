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
  //MeshBuilder,
  //Texture,
  //StandardMaterial,
  //Axis,
  Color4
} from "babylonjs";

// Here we extend Reacts component class
class Robot extends Component {
  colors = {
    red: new Color3(0.85, 0, 0),
    blue: new Color3(0, 0, 0.85),
    green: new Color3(0, 0.75, 0),
    yellow: new Color3(1, 0.85, 0),
    black: new Color3(0.2, 0.2, 0.2),
    white: new Color3(1, 1, 1),
    gray: new Color3(0.5, 0.5, 0.5),
    orange: new Color3(1, 0.5, 0),
    without: new Color4(1, 1, 1, 0)
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
    "front view": {
      id: "",
      alpha: 6.283,
      beta: 1.396,
      radius: 18
    },
    "side view": {
      id: "",
      alpha: 4.723,
      beta: 1.396,
      radius: 18
    },
    "top view": {
      id: "",
      alpha: 6.283,
      beta: -0.08,
      radius: 18
    },
    body: {
      id: "ROBOT_BODY",
      alpha: 6.878,
      beta: 1.281,
      radius: 18
    },
    "schlauch packet": {
      id: "EZ_ACHSE",
      alpha: 5.632,
      beta: 1.659,
      radius: 15
    },
    payload: {
      id: "PAYLOAD",
      alpha: 4.132,
      beta: 0.475,
      radius: 10
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
      Tools.ToRadians(80),
      20,
      new Vector3(0, 5, 0),
      this.scene
    );
    this.camera.attachControl(this.stage, true);
    this.camera.lowerRadiusLimit = 8;
    this.camera.upperRadiusLimit = 18;
    this.camera.lowerBetaLimit = this.camera.beta - Tools.ToRadians(85);
    this.camera.upperBetaLimit = this.camera.beta + Tools.ToRadians(60);
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
    let loadRobotModel = loader.addMeshTask("robot", "", "", "../robot.babylon");
    /*
     *  Loader is given a callback to run when the model has loaded
     *  the variable t is our imported scene. You can use
     *  it to examine all the mesh's loaded.
     */

    loadRobotModel.onSuccess = (t) => {
      this.scene.getMeshByID("BASE").material = this.scene
        .getMeshByID("BASE")
        .material.clone();
      this.scene.getMeshByID("ROBOT_BODY").material = this.scene
        .getMeshByID("ROBOT_BODY")
        .material.clone();
      this.scene.getMeshByID("DRIVE_1").material = this.scene
        .getMeshByID("DRIVE_1")
        .material.clone();
      this.scene.getMeshByID("DRIVE_2").material = this.scene
        .getMeshByID("DRIVE_2")
        .material.clone();
      this.scene.getMeshByID("DRIVE_3").material = this.scene
        .getMeshByID("DRIVE_3")
        .material.clone();
      this.scene.getMeshByID("EZ_ACHSE").material = this.scene
        .getMeshByID("EZ_ACHSE")
        .material.clone();
      this.scene.getMeshByID("PAYLOAD").material = this.scene
        .getMeshByID("PAYLOAD")
        .material.clone();

      this.scene.getMeshByID("BASE").material.diffuseColor = this.colors[
        "black"
      ];
      this.scene.getMeshByID("ROBOT_BODY").material.diffuseColor = this.colors[
        "orange"
      ];
      this.scene.getMeshByID("DRIVE_1").material.diffuseColor = this.colors[
        "black"
      ];
      this.scene.getMeshByID("DRIVE_2").material.diffuseColor = this.colors[
        "black"
      ];
      this.scene.getMeshByID("DRIVE_3").material.diffuseColor = this.colors[
        "black"
      ];
      this.scene.getMeshByID("EZ_ACHSE").material.diffuseColor = this.colors[
        "black"
      ];
      this.scene.getMeshByID("PAYLOAD").material.diffuseColor = this.colors[
        "gray"
      ];

      // Start the animation loop once the model is loaded
      this.engine.runRenderLoop(() => {
        this.scene.render();
        //this.scene.debugLayer.show();
      });
      // The model came in a little dark so lets add some extra light
      new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene);
    };
    // It also calls an Error callback if something goes wrong
    loadRobotModel.onError = function (task, message, exception) {
      console.log(message, exception);
    };
    // We return the fully configured loader
    return loader;
  };

  //loadLogo() {
  //  let url = "pxslogo.png";
  //  var materialPlane = new StandardMaterial("logo", this.scene);
  //  materialPlane.diffuseTexture = new Texture(url, this.scene);
  //  materialPlane.diffuseTexture.hasAlpha = true;
  //  materialPlane.specularColor = new Color3(0, 0, 0);

  //  let logo = MeshBuilder.CreatePlane(
  //    "logo",
  //    { width: 470 / 20, height: 440 / 20 },
  //    this.scene,
  //    true
  //  );
  //  logo.position = new Vector3(0, 0, -5);
  //  logo.rotate(Axis.X, Math.PI / 2);
  //  logo.material = materialPlane;
  //}

  //Build the scene when the component has been loaded.
  componentDidMount() {
    this.setEngine();
    this.setScene();
    this.setCamera();
    //  this.loadLogo();
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
export default Robot;
