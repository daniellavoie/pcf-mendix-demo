dependencies = {
    layers: [
        {
            name: "../mxui/mxui.js",
            resourceName: "mxui.mxui",
            dependencies: [ "mxui.mxui" ],
            discard: true
        },
        {
            name: "./widgets/widgets.js",
            resourceName: "widgets.widgets",
            dependencies: ["widgets.widgets"],
            layerDependencies: [ "../mxui/mxui.js" ],
            noref: true
        }
    ],
    prefixes: [
        [ "dojox", "../dojox" ],
        [ "dijit", "../dijit" ],

        [ "mxui", "../mxui" ],
        [ "mendix", "../mendix" ],

        [ "big", "../big" ],
        [ "MobileFeatures", "C:\\Users\\Daniel\\Documents\\Mendix\\CF-Push-Demo\\deployment\\web\\widgets\\MobileFeatures" ], [ "widgets", "C:\\Users\\Daniel\\Documents\\Mendix\\CF-Push-Demo\\deployment\\data\\tmp\\widgets" ]

    ]
};