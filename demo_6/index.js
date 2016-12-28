$(function () {
    var count = 0;
    $("input").on("change", function () {
        count++;
        var tag = `<mesh geometry="cube" position="${count * 2.2},0,0" color="${this.value}"/>`;
        gr("#main")("mesh").first().append(tag);
    });
});

//コンポーネントの登録
gr.registerComponent("Mouse", {

    //最初に呼ばれる
    $awake: function () {
        var _transform = this.node.getComponent(gr.lib.fundamental.Components.TransformComponent);
        var _initialRotation = _transform.localRotation;
        var _xsum = 0;
        var _ysum = 0;

        //Canvasのマウスイベントをハンドリング
        this.companion.get("canvasElement").addEventListener("mousemove", (m) => {
            if (!this._lastScreenPos) {
                this._lastScreenPos = {
                    x: m.screenX,
                    y: m.screenY
                };
                return;
            }

            //左ボタン押されてる
            if ((m.buttons & 1) > 0) {

                //前回位置との差分。
                _xsum += m.screenX - this._lastScreenPos.x;
                _ysum += m.screenY - this._lastScreenPos.y;
                let max = Math.PI / 2 / 0.01 / 2;
                _ysum = Math.max(-max, Math.min(max, _ysum));

                // 差分から回転計算
                let rotationVartical = gr.lib.math.Quaternion.angleAxis(-_xsum * 2 * 0.01, gr.lib.math.Vector3.YUnit);
                let rotationHorizontal = gr.lib.math.Quaternion.angleAxis(-_ysum * 2 * 0.01, gr.lib.math.Vector3.XUnit);
                let rotation = gr.lib.math.Quaternion.multiply(rotationVartical, rotationHorizontal);
                const rotationMat = gr.lib.math.Matrix.rotationQuaternion(rotation);

                // 計算した回転を適用
                _transform.localRotation = gr.lib.math.Quaternion.multiply(_initialRotation, rotation);
            }

            this._lastScreenPos.x = m.screenX;
            this._lastScreenPos.y = m.screenY;
        });
    }
});

