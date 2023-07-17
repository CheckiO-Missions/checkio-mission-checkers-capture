requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function checkersCaptureVisualization(tgt_node, data) {

            if (!data || !data.ext) {
                return
            }

            const [n, position, pieces] = data.in

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const attr = {
                board: [
                    // white
                    {
                        'stroke-width': '0.1',
                        'fill': '#FFFFFF'
                    },
                    // black
                    {
                        'stroke-width': '0.1',
                        'fill': '#D3D3D3',
                    },
                ],
                checker: {
                    start: {
                        'stroke-width': '0.7',
                        'fill': '#F0801A',
                    },
                    move: {
                        'stroke-width': '0.7',
                        'fill': '#FABA00',
                    },
                    opponent: {
                        'stroke-width': '0',
                        'fill': '#446FBA',
                    },
                },
                number: {
                    coordinate: {
                        'font-family': 'times',
                        'font-weight': 'bold',
                        'font-size': '10',
                        'fill': '#294270',
                        'stroke': 'none',
                    },
                    move: {
                        'font-family': 'times',
                        'font-weight': 'bold',
                        'fill': '#294270',
                        'stroke': 'none',
                    },
                },
            }

            /*----------------------------------------------*
             *
             * values
             *
             *----------------------------------------------*/
            const grid_seize_px = 200
            const os = 20
            const unit = grid_seize_px / n

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const paper = Raphael(tgt_node, grid_seize_px+os*2, grid_seize_px+os*2)

            /*----------------------------------------------*
             *
             * draw board
             *
             *----------------------------------------------*/
            const [px, py] = position.values
            paper.rect(os, os, 200, 200)
            for (let i = 0; i < n; i += 1) {
                for (let j = 0; j < n; j += 1) {
                    paper.rect(os+(unit*i), os+(unit*j), unit, unit).attr(
                        // attr.board[(j % 2) ? (i % 2) : 1 - (i % 2)])
                        attr.board[(i+j+px+py+n) % 2])
                }
            }

            /**---------------------------------------------
             * 
             * draw numbers
             * 
             *----------------------------------------------*/
            for (let i = 0; i < n; i += 1) {
                /** vertical */
                paper.text(os/2, (i+.5)*unit+os, n - i - 1).attr(attr.number.coordinate)
                /** horizontal */
                paper.text((i+.5)*unit+os, unit*n+os*1.5, i).attr(attr.number.coordinate)
            }

            /*----------------------------------------------*
             *
             * draw opponent-checkers
             *
             *----------------------------------------------*/
            pieces.forEach(o=>{
                let [x, y] = o.values
                paper.circle((x+.5)*unit+os, (n-y-.5)*unit+os, unit/2*.9).attr(attr.checker.opponent)
            })

            /*----------------------------------------------*
             *
             * draw start-checker
             *
             *----------------------------------------------*/
            paper.circle((px+.5)*unit+os, (n-py-.5)*unit+os, unit/2*.9).attr(attr.checker.start)
            paper.text((px+.5)*unit+os, (n-py-.5)*unit+os, 0).attr(attr.number.move).attr({'font-size': unit*.7})

            /*----------------------------------------------*
             *
             * func : draw caption
             *
             *----------------------------------------------*/
            let caption = null
            function draw_caption(num) {
                if (caption) {
                    caption.remove()
                }
                caption = paper.text(grid_seize_px/2 + os, os/2,
                'Click to display another one [' + num + '/ ' + moves.length + ']')
            }

            /*----------------------------------------------*
             *
             * func : draw checker-moves
             *
             *----------------------------------------------*/
            let move_objects = []
            function draw_move(num) {
                move_objects = []
                moves[num].forEach(([mx, my], idx)=>{
                    move_objects.push(paper.circle((mx+.5)*unit+os, (n-my-.5)*unit+os, unit/2*.9).attr(attr.checker.move))
                    move_objects.push(paper.text((mx+.5)*unit+os, (n-my-.5)*unit+os, idx+1).attr(attr.number.move).attr({'font-size': unit*.7}))
                })
            }

            /*----------------------------------------------*
             *
             * draw moves ( initial )
             *
             *----------------------------------------------*/
            if (! data.ext.explanation) {
                return
            }
            const moves = data.ext.explanation
            draw_move(0)

            /*----------------------------------------------*
             *
             * on click event (draw another-moves)
             *
             *----------------------------------------------*/
            if (moves.length > 1) {
                draw_caption(1)
                let data_idx = 0
                tgt_node.onclick = (() => {
                    for (let i = 0; i < move_objects.length; i += 1) {
                        move_objects[i].remove()
                    }
                    data_idx = (moves.length - 1 > data_idx) ? data_idx + 1 : 0
                    draw_move(data_idx)
                    draw_caption(data_idx+1)
                })
            }
        }

        var io = new extIO({
            animation: function($expl, data){
                checkersCaptureVisualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
