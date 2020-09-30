
var Control = {};

var URL_PARAMETERS;

var __resizeFunctions = {};

(function () {

var _definitionCode;

var _$stateDiagramJson;

var _$alertContainer;
var _$alert;

var ERROR_CODE = '<div class="alert alert-danger fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';

Control.init = function () {
    URL_PARAMETERS = Utils.getUrlParameters();

    _$stateDiagramJson = $('#stateDiagramJson');
    _$alertContainer = $('#alertContainer');

    StateDiagramGenerator.init();

    initDefinitionInput();
    Control.generateStateDiagram();

    Control.resize();
};

function initDefinitionInput() {
    _definitionCode = CodeMirror.fromTextArea($('#stateDiagramJsonTextarea')[0], {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: 'application/json',
        gutters: ["CodeMirror-lint-markers"],
        lint: true
    });

    __resizeFunctions.codeResize = function() {
        _definitionCode.setSize(_$stateDiagramJson.width(), _$stateDiagramJson.height());
    };

    $('#widen').click(function () {
        $('#mainContent, #mainNav').toggleClass('container container-fluid');
        $('span', this).toggleClass('glyphicon-resize-full glyphicon-resize-small');
        Control.resize();
    });

    $('#generateStateDiagram').click(Control.generateStateDiagram);
    $('#formatJson').click(function () {
        _definitionCode.setValue(formatter.formatJson(_definitionCode.getValue()));
    });
}

Control.resize = function () {
    for (var i in __resizeFunctions) {
        __resizeFunctions[i]();
    }
};

Control.generateStateDiagram = function () {
    if (_$alert) {
        _$alert.alert('close');
    }

    _$stateDiagramJson.closest('.form-group').removeClass('has-error');

    // var json = JSON.parse(_definitionCode.getValue());
    // StateDiagramGenerator.generate(json);
    // return;

    try {
        var json = JSON.parse(_definitionCode.getValue());
        StateDiagramGenerator.generate(json);
    } catch (e) {
        _$stateDiagramJson.closest('.form-group').addClass('has-error');
        _$alert = $(ERROR_CODE + '<strong>' + e + '</strong></div>');
        _$alertContainer.append(_$alert);
        _$alert.alert();

        throw e;
    }
};

$(window).load(Control.init);
$(window).resize(Control.resize);

})();
