$(function () {
  var i = 0;
  $("input").on("change", function () {
    console.log(i);
    i++;
    var tag = `<mesh geometry="cube" position="${i * 2.2},0,0" color="red"/>`
    gr("#main")("#m").append(tag);
  });
});

var Quaternion = gr.lib.math.Quaternion;
var Vector3 = gr.lib.math.Vector3;
var Matrix=gr.lib.math.Matrix;

gr.registerComponent("Mouse", {
  attributes: {
    speed:{
      converter:"Number",
      default:"2"
    }
  },


  $awake: function () {
    this.getAttributeRaw("speed").boundTo("_speed");
    this._transform = this.node.getComponent(gr.lib.fundamental.Components.TransformComponent);
    this._initialRotation = this._transform.localRotation;
    this._initialRight = Vector3.copy(this._transform.right);
    this._initialUp = Vector3.copy(this._transform.up);
    this._xsum = 0;
    this._ysum = 0;

    this.companion.get("canvasElement").addEventListener("mousemove",  (m)=> {
      if (!this._lastScreenPos) {
        this._lastScreenPos = {
          x: m.screenX,
          y: m.screenY
        };
        return;
      }

      if ((m.buttons & 1) > 0) { // When left button was pressed
        this._xsum += m.screenX - this._lastScreenPos.x;
        this._ysum += m.screenY - this._lastScreenPos.y;
        
        let max = Math.PI/2/0.01/this._speed;
        this._ysum = Math.min(max , this._ysum);
        this._ysum = Math.max(-max, this._ysum);

        // rotate excution
        let rotationVartical = Quaternion.angleAxis(-this._xsum * this._speed * 0.01, this._initialUp);
        let rotationHorizontal = Quaternion.angleAxis(-this._ysum * this._speed * 0.01, this._initialRight);
        let rotation = Quaternion.multiply(rotationVartical, rotationHorizontal);

        const rotationMat = Matrix.rotationQuaternion(rotation);
        this._transform.localRotation = Quaternion.multiply(this._initialRotation, rotation);
      }

      this._lastScreenPos = {
        x: m.screenX,
        y: m.screenY
      };
    });

  }
});

