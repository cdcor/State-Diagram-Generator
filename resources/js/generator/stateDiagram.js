
var StateDiagramGenerator = {};

(function () {

var _$display;

var _graph;
var _paper;
var _cells;
var _edgeCells;

// Holds the IDs of elements using their label as the key
var _ids;

StateDiagramGenerator.init = function () {
    _$display = $('#stateDiagram');

    _graph = new joint.dia.Graph();
    _paper = new joint.dia.Paper({
        el: _$display,
        width: _$display.width(),
        height: _$display.height(),
        gridSize: 1,
        model: _graph
    });
};

StateDiagramGenerator.generate = function (list) {
    _cells = [];
    _edgeCells = [];

    var states = list.states;
    var transitions = list.transitions;

    _ids = {};

    // Create states and transitions
    for (var i = 0; i < states.length; i++) {
        _cells.push(createState(states[i]));
    }
    for (i = 0; i < transitions.length; i++) {
        _edgeCells.push(createTransition(transitions[i]));
    }
    var startVertex = new CustomStartState();
    _cells.push(startVertex);
    _edgeCells.push(createStartTransition(startVertex, list.start));

    // Build the graph
    var allCells = _cells.concat(_edgeCells);
    _graph.resetCells(allCells);
    joint.layout.DirectedGraph.layout(_graph, {
        setLinkVertices: true,
        rankDir: 'LR',
        rankSep: 50,
        nodeSep: 200,
        edgeSep: 30
    });

    // Resize and re-position
    _paper.fitToContent(1, 1, 100);

    var links = _graph.getLinks();
    for (i = 0; i < links.length; i++) {
        var link = links[i];
        var attributes = link.attributes;
        var linkVertices = attributes.vertices;

        for (var j = 0; j < linkVertices.length; j++) {
            linkVertices[j].x += 50;
            linkVertices[j].y += 50;
        }

        if (attributes.source.id === attributes.target.id) {
            var position = _graph.getCell(attributes.source.id).attributes.position;
            var newLinkVertices = createLoopedEdgeVertices(position);
            for (var k = 0; k < newLinkVertices.length; k++) {
                linkVertices.push(newLinkVertices[k]);
            }
        }
    }
    var elements = _graph.getElements();
    for (i = 0; i < elements.length; i++) {
        elements[i].translate(50, 50);
    }

    window.graph = _graph;
};

function createState(state) {
    var stateShape = state.accept ? new CustomEndState() : new CustomState();
    stateShape.resize(Math.max(40, state.label.length * 10), 40);
    stateShape.attr('text/text', state.label);

    _ids[state.label] = stateShape.id;

    return stateShape;
}

function createTransition(transition) {
    return new joint.shapes.fsa.Arrow({
        source: { id: _ids[transition.from] },
        target: { id: _ids[transition.to] },
        labels: [
            {
                position: 0.5,
                attrs: {
                    text: {
                        text: transition.label.replace(/epsilon/gi, '\u03B5'),
                        'font-size': 15,
                        'font-family': 'Consolas, monospace'
                    }
                }
            }
        ]
    });
}

function createStartTransition(startVertex, startTargetLabel) {
    return new joint.shapes.fsa.Arrow({
        source: { id: startVertex.id },
        target: { id: _ids[startTargetLabel] }
    });
}

function createLoopedEdgeVertices(position) {
    var midX = _paper.options.width * 0.5;
    var midY = _paper.options.height * 0.5;

    var xFactor = 20;
    var yFactor = 20;

    // Add half the dimensions of the element (20) and the offset of the translations (50) to start in the middle
    //   TODO account for possibly larger element width
    var startX = position.x + 70;
    var startY = position.y + 70;

    var left = startX < midX;
    var top = startY < midY;

    startX += left ? -xFactor : xFactor;
    startY += top ? -yFactor : yFactor;

    return [{
        x: left ? startX - 15 : startX + 15,
        y: top ? startY - 15 : startY + 15
    }, {
        x: startX,
        y: top ? startY - 30 : startY + 30
    }];
}

// This is simply an invisible element to connect the start transition to
var CustomStartState = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"></g></g>',

    defaults: joint.util.deepSupplement({
        type: 'basic.Circle',
        size: { width: 10, height: 10 },
    }, joint.shapes.basic.Generic.prototype.defaults)
});

// A customized typical state for performance
var CustomState = joint.shapes.basic.Circle.extend({
    defaults: joint.util.deepSupplement({
        type: 'fsa.State',
        attrs: {
            circle: { 'stroke-width': 2 },
            text: {
                'font-family': 'Consolas, monospace',
                'font-size': 14,
                'font-weight': 'bold'
            }
        }
    }, joint.shapes.basic.Circle.prototype.defaults)
});

// Same as a typical state except with a double circle
var CustomEndState = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><circle/><circle class="inner"/></g><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'basic.Circle',
        size: { width: 60, height: 60 },
        attrs: {
            'circle': { fill: '#FFFFFF',
                stroke: 'black',
                'stroke-width': 2,
                r: 30,
                transform: 'translate(30, 30)'
            },
            '.inner': {
                r: 25
            },
            'text': {
                'font-family': 'Consolas, monospace',
                'font-size': 14,
                'font-weight': 'bold',
                 text: '',
                 'text-anchor': 'middle',
                 'ref-x': 0.5,
                 'ref-y': 0.5,
                 ref: 'circle',
                 'y-alignment': 'middle',
                 fill: 'black'
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

})();
