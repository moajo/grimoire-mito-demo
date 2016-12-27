$(function () {
    var count = 0;
    $("input").on("change", function () {
        count++;
        var tag = `<mesh geometry="cube" position="${count * 2.2},0,0" color="${this.value}"/>`;
        gr("#main")("mesh").first().append(tag);
    });
});

gr.registerComponent("Mouse", {
    $awake: function () {
        var _transform = this.node.getComponent(gr.lib.fundamental.Components.TransformComponent);
        this._initialRotation = _transform.localRotation;

        var _xsum = 0;
        var _ysum = 0;
        this.companion.get("canvasElement").addEventListener("mousemove", (m) => {
            if (!this._lastScreenPos) {
                this._lastScreenPos = {
                    x: m.screenX,
                    y: m.screenY
                };
                return;
            }

            if ((m.buttons & 1) > 0) { // When left button was pressed

                _xsum += m.screenX - this._lastScreenPos.x;
                _ysum += m.screenY - this._lastScreenPos.y;
                let max = Math.PI / 2 / 0.01 / 2;
                _ysum = Math.max(-max, Math.min(max, _ysum));

                // calculate rotation
                let rotationVartical = gr.lib.math.Quaternion.angleAxis(-_xsum * 2 * 0.01, gr.lib.math.Vector3.YUnit);
                let rotationHorizontal = gr.lib.math.Quaternion.angleAxis(-_ysum * 2 * 0.01, gr.lib.math.Vector3.XUnit);
                let rotation = gr.lib.math.Quaternion.multiply(rotationVartical, rotationHorizontal);
                const rotationMat = gr.lib.math.Matrix.rotationQuaternion(rotation);

                // rotate excution
                _transform.localRotation = gr.lib.math.Quaternion.multiply(this._initialRotation, rotation);
            }

            //update last screen pos.
            this._lastScreenPos.x = m.screenX;
            this._lastScreenPos.y = m.screenY;
        });

    }
});

