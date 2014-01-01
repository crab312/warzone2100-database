/*
	This file is part of 'Warzone 2100 Guide by crab'.

	'Warzone 2100 Guide by crab' is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	'Warzone 2100 Guide by crab' is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with 'Warzone 2100 Guide by crab'; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/

var data_directory = "data_master/stats/";

var Weapons;
var Bodies;
var Propulsion;
var Structures;
var PropulsionModifiers;
var StructureModifiers;
var PropulsionType;
var TerrainTable;
var Researches;
var Repair;
var Construction;
var ECM;
var Sensor;
var Features;
var TankDesigner;
var Templates;


var SelectedObject;
var Objects = new Array;

var TerrainTypesIndexes = [
    'TER_SAND',
    'TER_SANDYBRUSH',
    'TER_BAKEDEARTH',
    'TER_GREENMUD',
    'TER_REDBRUSH',
    'TER_PINKROCK',
    'TER_ROAD',
    'TER_WATER',
    'TER_CLIFFFACE',
    'TER_RUBBLE',
    'TER_SHEETICE',
    'TER_SLUSH',
];


$(function () {
    DrawPageHeader();
    DrawPageCaption();
});

function InitDataObjects() {
    /* Update localStorage, in case if site data structures was changed */

    InitResearchObjects();

    var current_site_version = "1.75";
    if (localStorage["site_version"] == undefined || localStorage["site_version"] != current_site_version) {
        localStorage.clear();
        localStorage["site_version"] = current_site_version;
    }

    {
        var obj = new Object;
        obj.sysid = "Design";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {

            $('body').block({
                message: null,
            });

            Designer_PreLoad(function () { $('body').unblock(); });
        };
        obj.do_not_load = true;
        TankDesigner = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "PropulsionType";
        obj.path_ini = data_directory + "propulsiontype.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () { };
        obj.non_researchable = true;
        PropulsionType = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "TerrainTable";
        obj.path_ini = data_directory + "terraintable.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () {
                /* Make terrain table more readable */
                for (var terrainIndex in data_obj.loaded_data_hash) {
                    data_obj.loaded_data_hash[terrainIndex].terrain_name = TerrainTypesIndexes[terrainIndex];
                    var vect = data_obj.loaded_data_hash[terrainIndex].speedFactor.split(',');
                    for (var prop_index in vect) {
                        var prop_type = PropulsionType.loaded_data[prop_index].grid_id;
                        data_obj.loaded_data_hash[terrainIndex][prop_type] = vect[prop_index];
                    }
                }
                for (var prop_type in PropulsionType.loaded_data_hash) {
                    data_obj.grid_colModel.push(
                    {
                        name: prop_type, width: "55px", fixed: true
                    });
                }
                DrawLeftGrid(data_obj);
            });
        };
        obj.grid_colModel = [
            { label: "Ter.Id", name: "grid_id", key: true, width: "40px", fixed: true },
            { label: "Terrain Name", name: "terrain_name", width: "150px", fixed: true },
        ];
        obj.non_researchable = true;
        TerrainTable = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Weapon";
        obj.path_ini = data_directory + "weapons.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.GetIconHtml_Function = function (rowObject, size) {
            var img_name = rowObject.grid_id + ".gif";
            if (typeof icon_files_hash != 'undefined') {
                if (icon_files_hash[img_name] == undefined) {
                    return EmptyComponentIcon_html(rowObject.name);
                } else {
                    if (size == undefined) {
                        return "<img src='data_icons/Weapon/" + img_name + "' onerror='$(this).hide();' title='" + rowObject.name + "'/>";
                    } else {
                        return "<img src='data_icons/Weapon/" + img_name + "' onerror='$(this).hide();' width='" + size + "' title='" + rowObject.name + "'/>";
                    }
                }
            } else {
                return '';
            }
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, width: "80px", hidden:true },
            { label: "Name", name: "name", formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>'}, },
            
            { label: "Research Line", name: "weaponSubClass" },
            { label: "Price", name: "buildPower", width: 45, formatter: function (cellvalue, options, rowObject) { return '$' + cellvalue }, sorttype: "int" },
            { label: "Range (tiles)", name: "longRange", sorttype: "int", formatter: function (cellvalue, options, rowObject) { return (cellvalue / 128).toFixed(1) }, width: 40 },
            {
                label: "Damage *", sortable: false,
                formatter: function (cellvalue, options, rowObject) {
                    var html_res = "";
                    if (rowObject.damage != undefined) {

                        if (rowObject.weaponClass == "HEAT") {
                            html_res += "<label style='color: darkred'><b>" + rowObject.damage + "</b></label>";
                            html_res += " (" + rowObject.weaponClass.toLowerCase() + ")";
                        } else {
                            html_res += "<b>" + rowObject.damage + "</b> (kinetic)";
                        }
                    }
                    
                    if (rowObject.radiusDamage != undefined && rowObject.radius != undefined) {
                        html_res += "</br>";
                        
                        if (rowObject.weaponClass == "HEAT") {
                            html_res += "<label style='color: darkred'><b>" + rowObject.radiusDamage + "</b></label> /" + (rowObject.radius / 128).toFixed(1) + " tiles";
                            html_res += " (" + rowObject.weaponClass.toLowerCase() + ")";
                        } else {
                            html_res += "<b>" + rowObject.radiusDamage + " /" + (rowObject.radius / 128).toFixed(1) + " tiles</b>";
                        }
                    }
                    
                    if (rowObject.periodicalDamage != undefined && rowObject.periodicalDamageRadius != undefined && rowObject.periodicalDamageTime != undefined) {
                        html_res += "</br>";
                        if (rowObject.periodicalDamageWeaponClass == "HEAT") {
                            html_res += "<label style='color: darkred'><b>" + rowObject.periodicalDamage + "</label></b> /sec" + "";
                            html_res += " (" + rowObject.periodicalDamageWeaponClass.toLowerCase() + ")";
                        } else {
                            html_res += "<b>" + rowObject.periodicalDamage + " /sec" + "</b>";
                        }
                    }
                    return html_res;
                }, width: 130
            },
            {
                label: "Rate of Fire",sortable:false,
                formatter: function (cellvalue, options, rowObject) { return Weapon_ShotsPerMinute(rowObject).toFixed(1) + " /min";}, width: 70,//
                sorttype: function (cell,rowObject) {
                    return parseInt(cell);//Math.ceil(Weapon_ShotsPerMinute(rowObject));
                }
            },
            { label: "Damage</br>modifier", name: "weaponEffect", width: 50, formatter: function (cellvalue, options, rowObject) { return "<label style='font-size:0.7em'>" + cellvalue + "</label>" }, },
        ];
        //obj.groupField = "weaponEffect";
        obj.groupingView = {
            groupField: ['weaponSubClass'],
            groupColumnShow: [false],
            groupText: ['<b>{0}</b>'],
            groupCollapse: false,
            groupOrder: ['asc'],
        };
        Weapons = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Body";
        obj.path_ini = data_directory + "body.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.GetIconHtml_Function = function (rowObject) {
            var img_name = rowObject.name == undefined ? rowObject.grid_id : rowObject.name.toLowerCase() + ".gif";
            var img_name2 = rowObject.grid_id + ".gif";
            if (typeof icon_files_hash != 'undefined') {
                var img_found = icon_files_hash[img_name] != undefined;
                if (!img_found) {
                    img_name = img_name2;
                    img_found = icon_files_hash[img_name] != undefined
                }
            }
            if (img_found){
                return "<img src='data_icons/Body/" + img_name + "' onerror='$(this).hide();' title='" + rowObject.name + "'/>";
            } else {
                return EmptyComponentIcon_html(rowObject.name);
            }
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, width: "80px", hidden: true },
            { label: "Name", name: "name", formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>'}, },
            { label: "Size", name: "size",width:60 },
            { label: "Price", name: "buildPower",width:60, formatter: function (cellvalue, options, rowObject) { return '$' + cellvalue },sorttype:"int" },
            { label: "Hit Points", name: "hitpoints",width:60 },
            { label: "Armor Kineric", name: "armourKinetic",width:60 },
            { label: "Armor Thermal", name: "armourHeat",width:60 },
           // { label: "Min Research Time", name: "minResearchTime", },
        ];
        obj.groupingView = {
            groupField: ['size'],
            groupColumnShow: [false],//style="height:27px; width:100%; font-size:1.2em; color: darkred;padding-left:50px;padding-top: 10px;"
            groupText: ['<div class="ui-widget-header ui-corner-top" style="padding:2px; margin-top:16px; font-size:1.1em" ><b>{0}</b></div>'],
            groupCollapse: false,
            groupOrder: ['asc'],
            groupDataSorted: true,
        };
        Bodies = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Propulsion";
        obj.path_ini = data_directory + "propulsion.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.GetIconHtml_Function = function (rowObject, size) {
            var img_name = rowObject.grid_id + ".gif";
            if (typeof icon_files_hash != 'undefined') {
                if (icon_files_hash[img_name] == undefined) {
                    return EmptyComponentIcon_html(rowObject.name);
                } else {
                    if (size == undefined) {
                        return "<img src='data_icons/Propulsion/" + img_name + "' onerror='$(this).hide();' title='" + rowObject.name + "'/>";
                    } else {
                        return "<img src='data_icons/Propulsion/" + img_name + "' onerror='$(this).hide();' width='" + size + "' height='auto' title='" + rowObject.name + "'/>";
                    }
                }
            } else {
                return '';
            }
        };
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, width: "80px", hidden: true },
            { label: "Name", name: "name", width: 90, formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>'}, },
            //{ label: "Class", name: "type" },
            { label: "Max Speed", name: "speed", sorttype: "int", formatter: function (cellvalue, options, rowObject) { return (cellvalue/128).toFixed(2) }, width: 60 },
            {
                label: "Engine power %", name: "buildPower",
                formatter: function (cellvalue, options, rowObject) {
                    if (PropulsionType.loaded_data != undefined) {
                        return PropulsionType.loaded_data_hash[rowObject.type].multiplier + '%';
                    }
                },
                sorttype: "int", width:60
            },
            { label: "Price %", name: "buildPower", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width:60 },
            { label: "Build time %", name: "buildPoints", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
            { label: "Hit Points %", name: "hitpoints", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
            { label: "Weight %", name: "weight", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
        ];
        Propulsion = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Structure";
        obj.path_ini = data_directory + "structure.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.GetIconHtml_Function = function (rowObject) {
            var img_name = rowObject.name.toLowerCase() + ".gif";
            var img_name2 = rowObject.grid_id + ".gif";
            if (typeof icon_files_hash != 'undefined') {
                var img_found = icon_files_hash[img_name] != undefined;
                if (!img_found) {
                    img_name = img_name2;
                    img_found = icon_files_hash[img_name] != undefined
                }
            }
            if (img_found) {
                return "<img src='data_icons/Structures/" + img_name + "' onerror='$(this).hide();' title='" + rowObject.name + "'/>";
            } else {
                return EmptyComponentIcon_html(rowObject.name);
            }
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, width: "80px", hidden: true },
            { label: "Name", name: "name", formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>' }, },
            { label: "Class", name: "strength" },
            { label: "Price", name: "buildPower", width: 45, formatter: function (cellvalue, options, rowObject) { return '$' + cellvalue }, sorttype: "int" },
            { label: "Build time", name: "buildPoints", width: 45, sorttype: "int" },
            { label: "Hit points", name: "hitpoints", width: 45, sorttype: "int" },
            { label: "Armor kinetic", name: "armour", width: 45, sorttype: "int" },
            { label: "Armor thermal", name: "armour", width: 45, sorttype: "int" },
            //{
            //    label: "Weapons", sortable:false, width: 100,
            //    formatter: function (cellvalue, options, rowObject) {
            //        if (rowObject.weapons != undefined) {
                        
            //        }
            //    },
            //},
        ];
        obj.groupingView = {
            groupField: ['strength'],
            groupColumnShow: [false],
            groupText: ['<div class="ui-widget-header ui-corner-top" style="padding:2px; margin-top:16px; font-size:1.1em" ><b>{0}</b></div>'],
            groupCollapse: false,
            groupOrder: ['asc'],
        };
        Structures = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "WeaponPropulsionModifiers";
        obj.path_ini = data_directory + "weaponmodifier.ini";
        obj.LoadDataFunction = function (DataObject, callback_function) {
            LoadDataObject(DataObject, function () {
                if (DataObject.loaded_data_hash["ALL ROUNDER"] != undefined) {
                    DataObject.loaded_data_hash["ANTI AIRCRAFT"] = DataObject.loaded_data_hash["ALL ROUNDER"]; // fix error. in Warzone source "ANTI AIRCRAFT" is processed as "ALL ROUNDER"
                }
                if (callback_function != undefined) {
                    callback_function();
                }
            });
        }
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () {
                var container_id = "Grid_COntainer2";
               // ResetGridContainer("Props_Container", false);
                DrawGrid(data_obj, container_id, null);
                //DrawLeftGrid(data_obj);
            });
        };

        var formatter_modifier = function (cellvalue, options, rowObject) {
            var res_html = "";
            res_html = "<div style='width:100%;text-align: center;'>";
            res_html += "<div style='font-size:1.2em; color:darkred;display:block;'><b>";
            res_html += cellvalue + "%";
            res_html += "</b></div>";
            res_html += "</div>";
            return res_html;
        };

        var formatter_weapon_icons =  function (cellvalue, options, rowObject) {
            if (Weapons.loaded_data != undefined) {
                var res_html = "<div style='margin-top: 5px; margin-bottom: 5px;'>";
                for (var i = 0; i < Weapons.loaded_data.length; i++) {
                    if (Weapons.loaded_data[i].weaponEffect != undefined) {
                        if (Weapons.loaded_data[i].weaponEffect == rowObject.grid_id) {
                            if(typeof icon_files_hash == 'undefined')
                            {
                                        
                            }else
                            {
                                var img_html_tmp = Weapons.GetIconHtml_Function(Weapons.loaded_data[i], 48);
                                if(img_html_tmp == "")
                                {
                                    res_html += '<div style="font-size: 0.7em; word-wrap: break-word; width:50px; height:40px; display:inline-block; float: left; margin:1px"><div style=" padding:1px; width:43px; height:33px; border: 1px dotted;" title="' + Weapons.loaded_data[i].name  + '">' + Weapons.loaded_data[i].name + '</div></div>';
                                }else
                                {
                                    res_html += '<div style="width:50px; height:40px; display:inline-block; float: left; margin:1px">' + img_html_tmp + '</div>';
                                }
                            }
                        }
                    }
                }
                res_html += "</div>"
                return res_html;
            }
            return '';
        }

        obj.grid_colModel = [
            {
                label: "Weapon Class", name: "grid_id", key: true, width: 70,
                formatter: function (cellvalue, options, rowObject) {
                    return "<div style='font-size:0.9em'><b>" + cellvalue + "</b></div>";
                },
            },
            {
                name: "Weapons", width: '530px',
                formatter: formatter_weapon_icons,
            },
            {
                label: "Half-Tracked", name: "Half-Tracked", width:'80px',
                formatter: formatter_modifier
            },
            {
                label: "Wheeled", name: "Wheeled", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "Tracked", name: "Tracked", width: '80px',
                formatter: formatter_modifier, 
            },
            {
                label: "Hover", name: "Hover", width: '80px',
                formatter: formatter_modifier, 
            },
            {
                label: "Cyborgs", name: "Legged", width: '80px',
                formatter: formatter_modifier, 
            },
            {
                label: "VTOL", name: "Lift", width: '80px',
                formatter: formatter_modifier, 
            },
        ];
        PropulsionModifiers = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "WeaponStructureModifiers";
        obj.path_ini = data_directory + "structuremodifier.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () {
                var container_id = "Grid_COntainer2";
                //ResetGridContainer("Props_Container", false);
                DrawGrid(data_obj, container_id, null);
            });
        };
        obj.grid_colModel = [
            {
                label: "Weapon Class", name: "grid_id", key: true, width: 70,
                formatter: function (cellvalue, options, rowObject) {
                    return "<div style='font-size:1.1em'><b>" + cellvalue + "</b></div>";
                },
            },
            {
                name: "Weapons", width: '580px',
                formatter: formatter_weapon_icons,
            },
            {
                label: "SOFT", name: "SOFT", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "MEDIUM", name: "MEDIUM", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "HARD", name: "HARD", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "BUNKER", name: "BUNKER", width: '80px',
                formatter: formatter_modifier,
            },
        ];
        StructureModifiers = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Research";
        obj.path_ini = data_directory + "research.ini";
        obj.LoadDataFunction = LoadResearch;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            {
                label: "Name", name: "name", formatter: function (cellvalue, options, rowObject) {
                    return '<b>' + cellvalue + '</b>';
                },
                width: 350,
            },
            {
                label: "Price", name: "researchPower", formatter: function (cellvalue, options, rowObject) {
                    return '$' + cellvalue;
                },
                width: 50,
            },
        ];
        Researches = obj;

        obj.GetIconHtml_Function = function (rowObject) {
            if (rowObject.statID != undefined) {
                var stat_id = rowObject.statID;
                /* search stat_id */
                for (var i = 0; i < Objects.length; i++) {
                    if (Objects[i].GetIconHtml_Function != undefined) {
                        if (Objects[i].loaded_data_hash == undefined ? false : Objects[i].loaded_data_hash[stat_id] != undefined) {
                            return Objects[i].GetIconHtml_Function(Objects[i].loaded_data_hash[stat_id]);
                        }
                    }
                }
            }
            return EmptyComponentIcon_html(rowObject.name);
        };

        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Repair";
        obj.path_ini = data_directory + "repair.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "Name", name: "name" },
            { label: "repairPoints", name: "repairPoints" },
            { label: "Hit points", name: "hitpoints", width: 45, sorttype: "int" },
        ];
        Repair = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Construction";
        obj.path_ini = data_directory + "construction.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "Name", name: "name" },
            { label: "Power of build ray", name: "buildPoints" },
            { label: "Price", name: "buildPower" },
            { label: "Hit points", name: "hitpoints", width: 45, sorttype: "int" },
        ];

        obj.GetIconHtml_Function = function (rowObject, size) {
            var img_name = rowObject.grid_id + ".gif";
            if (typeof icon_files_hash != 'undefined') {
                if (icon_files_hash[img_name] == undefined) {
                    return EmptyComponentIcon_html(rowObject.name);
                } else {
                    if (size == undefined) {
                        return "<img src='data_icons/SupportTurrets/" + img_name + "' onerror='$(this).hide();' title='" + rowObject.name + "'/>";
                    } else {
                        return "<img src='data_icons/SupportTurrets/" + img_name + "' onerror='$(this).hide();' width='" + size + "' height='auto' title='" + rowObject.name + "'/>";
                    }
                }
            } else {
                return '';
            }
        };

        Construction = obj;
        Objects.push(obj);
    }

    {
        Sensor = {
            sysid: "Sensor",
            path_ini: data_directory + "sensor.ini",
            LoadDataFunction: LoadDataObject,
            LoadLeftGridFunction: function () {
                var data_obj = this;
                data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
            },
            grid_colModel: [
                { label: "ID", name: "grid_id", key: true, hidden: true },
                { label: "Name", name: "name" },
                { label: "Range", name: "range" },
                { label: "Price", name: "buildPower" },
                { label: "Hit points", name: "hitpoints", width: 45, sorttype: "int" },
            ],
            GetIconHtml_Function: Construction.GetIconHtml_Function,
        };
        Objects.push(Sensor);
    }

    {
        var obj = new Object;
        obj.sysid = "ECM";
        obj.path_ini = data_directory + "ecm.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "Name", name: "name" },
            { label: "Range", name: "range" },
        ];
        ECM = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Features";
        obj.path_ini = data_directory + "features.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "Name", name: "name" },
            { label: "Armour", name: "armour" },
            { label: "Hit Points", name: "hitpoints" },
        ];
        obj.non_researchable = true;
        Features = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Templates";
        obj.path_ini = data_directory + "templates.ini";
        obj.LoadDataFunction = LoadDataObject;
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "Name", name: "name" },
            { label: "Body", name: "compBody" },
            { label: "Propulsion", name: "compPropulsion" },
            { label: "Type", name: "type" },
            { label: "Weapons", name: "weapons" },
        ];

        obj.GetIconHtml_Function = function (rowObject, size) {
            var img_name = null;
            var img_folder = null;
            if (rowObject.type == "CYBORG" || rowObject.type == "CYBORG_SUPER") {
                img_name = rowObject.weapons.split(',')[0] + ".gif";
                img_folder = 'Weapon';
            }
            if (rowObject.type == "CYBORG_CONSTRUCT") {
                img_name = rowObject.compConstruct + ".gif";
                img_folder = 'SupportTurrets';
            }
            if (rowObject.type == "CYBORG_REPAIR") {
                img_name = rowObject.compRepair + ".gif";
                img_folder = 'SupportTurrets';
            }
            if(img_name != null){
                if (typeof icon_files_hash != 'undefined') {
                    if (icon_files_hash[img_name] == undefined) {
                        return EmptyComponentIcon_html(rowObject.name);
                    } else {
                        if (size == undefined) {
                            return "<img src='data_icons/" + img_folder + "/" + img_name + "' onerror='$(this).hide();' title='" + rowObject.name + "'/>";
                        } else {
                            return "<img src='data_icons/" + img_folder + "/" + img_name + "' onerror='$(this).hide();' width='" + size + "' height='auto' title='" + rowObject.name + "'/>";
                        }
                    }
                } else {
                    return '';
                }
            }
        };

        Templates = obj;
        //Objects.push(obj); do not add to 'objects' array because we do not need load templates in LoadAll(..) function
    }

}

$.ajaxPrefilter("text", function (options) {
    options.crossDomain = true;
});

function GetSelectedColumns(DataObject) {
    if (localStorage[DataObject.sysid + "_SelectedColumns"] != undefined) {
        try {
            return JSON.parse(localStorage[DataObject.sysid + "_SelectedColumns"]);
        } catch (e) {
            localStorage.removeItem(DataObject.sysid + "_SelectedColumns");

        }
    }
    return {};
}

function DrawLeftGrid(DataObject) {
    var container_id = "TreeGrid_Left_Container";
    ResetGridContainer("Props_Container", false);
    DrawGrid(DataObject, container_id, function (rowObject) { ShowProps(rowObject); });
}

function DrawLeftGrid_WithProperties(DataObject) {
    
}

function DrawGrid(DataObject, container_id, on_select_callback, container_height, container_width) {
    var grid_data = DataObject.loaded_data;
    var finalColModel = new Array;
    finalColModel = finalColModel.concat(DataObject.grid_colModel);
    var selected_columns = GetSelectedColumns(DataObject);
    for (var i = 0; i < DataObject.all_columns.length; i++) {
        var col_added = false;
        for (var j = 0; j < DataObject.grid_colModel.length; j++) {
            if (DataObject.all_columns[i].name == DataObject.grid_colModel[j].name && DataObject.grid_colModel[j].hidden != true) {
                
                col_added = true;
                break;
            }
        }
        if (!col_added) {
            if (selected_columns[DataObject.all_columns[i].name] != undefined) {
                finalColModel.push(DataObject.all_columns[i]);
            }
        }
    }

    /* draw grid method */
    var grid_element_id = ResetGridContainer(container_id, true);
    var grid_toolbar_id = grid_element_id + "_toolbar";
    if (container_height != undefined) {
        $("#" + container_id).height(container_height);
    } else {
        $("#" + container_id).height($(window).height() - $("#" + container_id).offset().top - 39);
    }
    if (container_width != undefined) {
        $("#" + container_id).width(container_width);
    }
    var grid = $(grid_element_id);
    if (DataObject.GetIconHtml_Function != undefined) {

        finalColModel = [{
            name: 'pic',
            width: '65px',
            sortable: false,
            search: false,
            formatter: function (cellvalue, options, rowObject) {
                return DataObject.GetIconHtml_Function(rowObject);
            }
        }].concat(finalColModel);
    }
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        //height: "100%",
        height: Math.max($("#" + container_id).height() - 110, 400),
        scrollerbar: true,
        colModel:
            [
             { label: "", name: "", width: "15px", sortable: false, search: false },
             { label: "", name: "index_of_datarow", hidden: true },
            ]
            .concat(finalColModel),
        autowidth: false,
        shrinkToFit: false,
        width: $("#" + container_id).width() - 20,
        sortname: "name",
        onSelectRow: function (rowid) {
            if (on_select_callback != null && on_select_callback != undefined) {
                on_select_callback(DataObject.loaded_data_hash[rowid]);
            }
        },
        toppager: true,
        cloneToTop: true,
        loadonce: true,
        pager: grid_toolbar_id,
        viewrecords: true,
        pgbuttons: false, //hide paging buttons
        pginput: false,   //hide current page number
        recordtext: "records: {2}",
        ignoreCase: true, //make search case insensitive
        grouping: DataObject.groupingView != undefined,
        groupingView: DataObject.groupingView,
        scrollrows: true,
    });

    myAddButton = function (options) {
        grid.jqGrid('navButtonAdd', grid_toolbar_id, options);
        grid.jqGrid('navButtonAdd', '#' + grid[0].id + "_toppager", options);
    };

    grid.jqGrid('navGrid', grid_toolbar_id, { view: true, edit: false, add: false, del: false, search: true, refresh: false, cloneToTop: true });

    myAddButton({
        caption: "Choose columns",
        title: "Hide/Show additional columns",
        onClickButton: function () {
            ShowSelectColumns(DataObject);
            // grid.jqGrid('columnChooser');
        }
    });
    grid.jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: "cn" });

    return grid;
}

function LoadResearch(DataObject, callback_function) {
    LoadDataObject(DataObject, function () {
        if (DataObject.FirstLoad_Tmp == undefined) {
            for (var i = 0; i < DataObject.loaded_data.length; i++) {
                if (DataObject.loaded_data[i].results == undefined) {
                    DataObject.loaded_data[i].results = [];
                } else {
                    DataObject.loaded_data[i].results_string = DataObject.loaded_data[i].results;
                    DataObject.loaded_data[i].results = DataObject.loaded_data[i].results.split(',');
                }

            }
        }
        DataObject.FirstLoad_Tmp = true;
        callback_function();
    });
}

//var readfile;
function LoadDataObject(DataObject, callback_function) {
    if (DataObject.loaded_data == undefined) {

        var method_process_loaded_data = function (DataObject, loaded_data, callback_function) {
            var readfile = jQuery.parseJSON(loaded_data);
            var grid_data = [];
            var fields_dict = new Array();
            var grid_columns = new Array();
            DataObject.loaded_data_hash = {};
            for (var key in readfile) {
                var data_row = readfile[key];
                data_row.grid_id = key;
                data_row.index_of_datarow = grid_data.length;
                grid_data.push(data_row);

                for (var propertyName in data_row) {
                    var isNumber = !isNaN(data_row[propertyName]);
                    if (isNumber) {
                        //try convert all strings to numbers if possible (was unable to do this in php_parse_ini)
                        data_row[propertyName] = parseInt(data_row[propertyName]);
                    }
                    if (fields_dict[propertyName] == undefined) {
                        fields_dict[propertyName] = 1;
                        var grid_col = new Object;
                        grid_col.name = propertyName;
                        grid_col.label = propertyName;
                        if (isNumber) {
                            grid_col.width = 45;
                        } else {
                            grid_col.width = 80;
                        }
                        grid_columns.push(grid_col);
                    }
                }
                DataObject.loaded_data_hash[key] = data_row;
            }
            DataObject.all_columns = grid_columns;
            DataObject.loaded_data = grid_data;
            if (callback_function != undefined) {
                callback_function();
            }
        }

        if (localStorage[DataObject.sysid + "_loaded_data"] != undefined) {
            method_process_loaded_data(DataObject, localStorage[DataObject.sysid + "_loaded_data"], callback_function);
        }
        else {
            /* retrievind data from server */
            ShowLoading('tabs_left');
            $.ajax({
                url: "stuff.php",
                data: { url: DataObject.path_ini },
                datatype: "text",
                success: function (msg) {
                    localStorage[DataObject.sysid + "_loaded_data"] = msg;
                    method_process_loaded_data(DataObject, msg, callback_function);
                    HideLoading('tabs_left');
                },
                error: function (msg) {
                    HideLoading('tabs_left');
                    alert('Error happened. Please try to reload page.');
                }
            });
        }
    } else {
        HideLoading('tabs_left');
        if (callback_function != undefined) {
            callback_function();
        }
    }
}


function ShowProps(RowData) {
    //Props_Container
    var grid_element_id = ResetGridContainer("Props_Container", false);
    var grid = $(grid_element_id);
    var grid_data = $.map(RowData, function (value, key) {
        var res = new Object;
        res.id = key;
        res.value = value;
        return res;
    });
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: "auto",
        colModel:
            [
                { label: "Name", name: "id", key: true, width: "50px" },
                { label: "Value", name: "value" },
            ],
        autowidth: true,
        //width: 500,
        sortname: "name",
        onSelectRow: function (rowid) {
        },
    });


}

function ShowSelectColumns(DataObject) {
    var container_id = "dialog_grid";
    var table_id = ResetGridContainer(container_id);
    var grid = $(table_id);

    var selected_columns = GetSelectedColumns(DataObject);
    for (var i = 0; i < DataObject.all_columns.length; i++) {
        var col_added = false;
        for (var j = 0; j < DataObject.grid_colModel.length; j++) {
            if (DataObject.all_columns[i].name == DataObject.grid_colModel[j].name) {
                if (DataObject.grid_colModel[j].hidden != true) {
                    DataObject.all_columns[i].col_visible = true;
                    col_added = true;
                }
                break;
            }
        }
        if (!col_added) {
            if (selected_columns[DataObject.all_columns[i].name] != undefined) {
                DataObject.all_columns[i].col_visible = true;
                col_added = true;
            }
        }
        if (!col_added) {
            DataObject.all_columns[i].col_visible = false;
        }
    }


    var grid_data = DataObject.all_columns;

    LeftRootsBox_OpenedDialog = $("#dialog_grid").dialog(
    {
        title: "Choose your columns",
        buttons:
        {
            "Save": function () {
                var selected_columns = {};
                for (var i = 0; i < grid_data.length; i++) {
                    var rowData = grid.jqGrid('getRowData', grid_data[i].name);
                    if (rowData.col_visible == "True") {
                        selected_columns[grid_data[i].name] = 1;
                    }
                }
                localStorage[DataObject.sysid + "_SelectedColumns"] = JSON.stringify(selected_columns);
                DrawLeftGrid(DataObject);
                $(this).dialog('close');
            },
            "Cancel": function () {
                $(this).dialog('close');
            }
        },
        modal: true,
        width: 600,
        height: 450,
        // position: { my: "center ce", at: "left bottom", of: window }
    });

    //var selectedIds = $("#" + options.gid).jqGrid('getGridParam', 'selectedIds');

    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: "auto",
        colModel:
            [
                { label: "System Name", name: "name", key: true, width: 100 },
                { label: "Name", name: "label", width: 150 },
                { label: "Description", name: "col_descr", width: 150 },
                {
                    label: ' - ',
                    name: 'col_visible',
                    width: 30,
                    resizable: true,
                    editable: true,
                    align: 'center',
                    formatter: "checkbox",
                    edittype: 'checkbox',//style='height:22px;width:20px;'
                    formatoptions: { disabled: false },
                    classes: 'check',
                    editoptions: { size: 39, value: "True:False" }
                },
            ],
        onSelectRow: function (rowid) {
        },
    });
}


function EmptyComponentIcon_html(name) {
    var name = name == undefined ? "...where is my name?" : name;
    var shown_name = name;
    if (name.length > 22) {
        shown_name = name.substring(0, 21) + '...';
    }
    return '<div style="font-size: 0.7em; word-wrap: break-word; width:50px; height:40px; display:inline-block; float: left; margin:1px"><div style=" padding:1px; width:43px; height:33px; border: 1px dotted;" title="' + name + '">' + shown_name + '</div></div>';
}


function DrawPageHeader() {

    var html = '\
            <div style="text-align:center;">\
            <div class="ui-corner-top" style="margin-bottom:-5px;width:100%; height:185px;background:url(\'./Styles/wz2100netbanner.jpg\') no-repeat left top #ffffff; color: #FFFFFF">\
                <img src="./Styles/wz2100netlogo.png" width="186" height="86" alt="" title="" style="margin-top:10px"/>\
            </div>\
            <div class="ui-accordion ui-widget ui-helper-reset ui-corner-top" style=";margin-top:-85px;margin-bottom:-5px;"> \
                <a href="index.html" class="ui-helper-reset" style="font-size:0.9em">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Guide\
		            </h3>\
                </a>\
                <a href="weapons.php" class="ui-helper-reset" style="font-size:0.9em;">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Weapons\
		            </h3>\
                </a>\
                <a href="Body.php" class="ui-helper-reset" style="font-size:0.9em">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top  ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Bodies\
		            </h3>\
                </a>\
                <a href="propulsion.php" class="ui-helper-reset" style="font-size:0.9em">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Propulsion\
		            </h3>\
                </a>\
                <a href="cyborgs.php" class="ui-helper-reset" style="font-size:0.9em">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Cyborgs\
		            </h3>\
                </a>\
                <a href="structure.php" class="ui-helper-reset" style="font-size:0.9em">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Buildings\
		            </h3>\
                </a>\
                <a href="stats.php" class="ui-helper-reset" style="font-size:0.9em">\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:100px; display:inline-block">\
                        Database\
		            </h3>\
                </a>\
                <a href="design.php" class="ui-helper-reset" style="font-size:0.9em" >\
		            <h3 class="ui-accordion-header ui-helper-reset ui-state-active ui-corner-top ui-accordion-noicons" style="padding-bottom:7px;background:rgba(255,255,255,0.76);width:130px; display:inline-block">\
                        <span class="ui-icon ui-icon-star" style="display:inline-block;padding:0px;margin-bottom:-4px"></span>Tank Designer\
		            </h3>\
                </a>\
            </div>\
            </div>\
    \
    ';

    var elm = $('#page_header');
    if (elm.length > 0) {
        elm.html(html);
    }
}

function DrawPageCaption() {
    var elm = $('#page_caption');
    if (elm.length > 0) {

        var html = '\
        <div class="ui-accordion ui-widget ui-helper-reset">\
            <h3 style="text-align:left; font-size:1.1em;margin-bottom:-10px;padding-bottom:10px;background:rgba(255,255,255,0.90)" class="ui-accordion-header ui-helper-reset ui-state-active ui-accordion-icons ui-accordion-header-active">\
                <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s" style="float:left;"></span>\
        ' + elm.attr('data-caption') +'\
            </h3>\
        </div>';
        elm.html(html);
    }
}

function DrawResearchSlider(container_id, init_value, slide_function) {

    $('#' + container_id).html('');
    var slider_id = container_id + "_research_slider";
    var input_id = container_id + "_research_slider_input";
    var slider_elem = $('<label for="' + input_id + '">Research time:</label><input type="text" id="' + input_id + '" style="border: 0; font-weight: bold;" /><div id="' + slider_id + '"></div>');
    slider_elem.appendTo($("#" + container_id));

    var func_val_slider = function (value) {
        return value.toHHMMSS();
    };
    jQuery('#' + slider_id).slider({
        min: 0,
        max: 5400,
        step: 30,
        value: init_value,
        range: "min",
        slide: function (event, ui) {
            jQuery('#' + input_id).val(func_val_slider(ui.value));
            if (designer_setted_timeout != undefined) {
                clearTimeout(designer_setted_timeout);
                designer_setted_timeout = undefined;
            };
            designer_setted_timeout = setTimeout(function () {
                if (slide_function != undefined) {
                    slide_function($('#' + slider_id).slider("value"));
                }
            }, 500);
        }
    });
    $('#' + input_id).val(func_val_slider($('#' + slider_id).slider("value")));
}

var sub_sections_index = 1;
function DrawSection_type1_html(container_id, caption) {
    var capt_container_name = container_id + '_capt' + sub_sections_index++;
    var sub_container_name = container_id + '_sub' + sub_sections_index++;
    var html = '\
    <div class="ui-accordion ui-widget ui-helper-reset" role="tablist" id="' + capt_container_name + '"> \
        <h3 style="text-align:left" class="ui-accordion-header ui-helper-reset ui-accordion-icons ui-accordion-header-active ui-state-active ui-corner-top"> \
            <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s" style="float:left;"></span> \
    ' + caption + '\
    </h3>\
    <div id="' + sub_container_name + '" class="ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active" style="display: block; text-align:left">\
    </div>';
    $('#' + container_id).append(html);
    return $('#' + sub_container_name);
}

function DrawSection_type2_html(container_id, caption) {
    var sub_container_name = container_id + '_sub' + sub_sections_index++;
    var html = '\
    <div class="ui-widget my-header ui-widget-header ui-corner-top">' + caption + '</div> \
        <div id="' + sub_container_name + '" class="ui-widget ui-widget-content"></div>';
    $('#' + container_id).append(html);
    return $('#' + sub_container_name);
}

function DrawSection_type2_1_html(container_id, caption) {
    var capt_container_name = container_id + '_capt' + sub_sections_index++;
    var sub_container_name = container_id + '_sub' + sub_sections_index++;
    var html = '\
    <div class="ui-accordion ui-widget ui-helper-reset" id="' + capt_container_name + '"> \
        <h3 style="text-align:left" class="ui-accordion-header ui-helper-reset ui-accordion-icons ui-corner-top ui-widget-header"> \
            <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s" style="float:left;"></span> \
    ' + caption + '\
    </h3>\
    <div id="' + sub_container_name + '" class="ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active" style="display: block; text-align:left">\
    </div>';
    $('#' + container_id).append(html);
    return $('#' + sub_container_name);
}

function FindTurretById(comp_id) {
    if (Weapons.loaded_data_hash[comp_id] != undefined) {
        return Weapons.loaded_data_hash[comp_id];
    }
    if (Repair.loaded_data_hash[comp_id] != undefined) {
        return Repair.loaded_data_hash[comp_id];
    }
    if (Construction.loaded_data_hash[comp_id] != undefined) {
        return Construction.loaded_data_hash[comp_id];
    }
    if (ECM.loaded_data_hash[comp_id] != undefined) {
        return ECM.loaded_data_hash[comp_id];
    }
    if (Sensor.loaded_data_hash[comp_id] != undefined) {
        return Sensor.loaded_data_hash[comp_id];
    }
    return null;
}

function FindComponentDataObject(comp_id) {
    if (Weapons.loaded_data_hash[comp_id] != undefined) {
        return Weapons;
    }
    if (Repair.loaded_data_hash[comp_id] != undefined) {
        return Repair;
    }
    if (Construction.loaded_data_hash[comp_id] != undefined) {
        return Construction;
    }
    if (ECM.loaded_data_hash[comp_id] != undefined) {
        return ECM;
    }
    if (Sensor.loaded_data_hash[comp_id] != undefined) {
        return Sensor;
    }
    return null;
}

function scrollToRow(targetGrid, id) {

    $('html, body').animate({
        scrollTop: $("#" + id).offset().top
    }, {
        duration: 800,
        complete: function () {

        }
    });
}

/*
var Weapons;
var Bodies;
var Propulsion;
var Structures;
var PropulsionModifiers;
var StructureModifiers;
var PropulsionType;
var TerrainTable;
var Researches;
var Repair;
var Construction;
var ECM;
var Sensor;
var Features;
var TankDesigner;
var Templates;*/