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

var current_site_version = "2.30";

$(function () {

    //Browser version check
    //if (($.browser.name == "Safari" && $.browser.fullVersion < '5.1') ||
    //    ($.browser.name == "Opera" && $.browser.version < '13') ||
    //    ($.browser.name == "Chrome" && $.browser.version < '32') ||
    //    ($.browser.name == "Microsoft Internet Explorer" && $.browser.version < '10') ||
    //    ($.browser.name == "Firefox" && $.browser.version < '25')) 
    //{
    //    var html = '<div id="browser_warning" style="padding:10px;font-size:1.3em;background-color:#ffffdd;color;red;position:fixed;top:10px;left:10%;right:10%;z-index:1000;cursor:pointer;">Warning! You are unsing some old version of your web-browser. Some features of this site might be unsupported. Please upgrade your browser. ' + $.browser.name + $.browser.fullVersion + '</div>';
    //    $('body').append(html);
    //    $('#browser_warning').click(null, function(event){
    //        $('#browser_warning').remove();
    //    });
    //}

    /* Update localStorage, in case if site data structures was changed */
    if (localStorage["site_version"] == undefined || localStorage["site_version"] != current_site_version) {
        localStorage.clear();
        localStorage["site_version"] = current_site_version;
    }

    /* multi-language stuff*/
    //if (false)
    //{
    //    $('head').append('<style type="text/css" id="lang_css"></style>');
    //    SetSiteLanguage();
    //}

    //if (localStorage["lang"] == undefined) {
    //    localStorage["lang"] = "en";
    //}
    //$('#lang_select').val(localStorage["lang"]);

    $('head').append('<link href="./Styles/icon1.ico" rel="shortcut icon" type="image/x-icon" />');
    DrawPageHeader();
    DrawPageCaption();

    if ($('#lang_select').length > 0) {
        $('#lang_select').val(site_language());
    }

    if (site_language() != "en") {
        require('/data_master/namestxt_translated.js');
    }

    //var comments_area = $('#page_comments_area');
    //if (comments_area.length > 0) {
    //    comments_area.css("margin-top", "20px");
    //    var comments_area_content = DrawSection_type2_html("page_comments_area", "<span lang='en'>Comments</span><span lang='ru'>Комментарии</span>");
    //    comments_area_content.css({
    //        "padding": "20px",
    //    });
    //    AddDiscuss($('#' + comments_area_content.attr('id')), window.location.href.split('?')[0]);
    //}
});

function InitDataObjects() {
    InitResearchObjects();
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
        obj.path_json = data_directory + "propulsiontype.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () { };
        obj.non_researchable = true;
        PropulsionType = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "TerrainTable";
        obj.path_json = data_directory + "terraintable.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () {
                /* Make terrain table more readable */
                for (var terrainIndex in data_obj.loaded_data_hash) {
                    data_obj.loaded_data_hash[terrainIndex].terrain_name = TerrainTypesIndexes[terrainIndex];
                    var vect = data_obj.loaded_data_hash[terrainIndex].speedFactor;
                    for (var prop_index in vect) {
                        var prop_type = PropulsionType.loaded_data[prop_index].grid_id;
                        data_obj.loaded_data_hash[terrainIndex][prop_type] = vect[prop_index];
                    }
                }
                data_obj.grid_colModel = JSON.parse(JSON.stringify(data_obj.grid_colModel_default));
                for (var prop_type in PropulsionType.loaded_data_hash) {
                    data_obj.grid_colModel.push(
                    {
                        name: prop_type, width: "55px", fixed: true
                    });
                }
                DrawLeftGrid(data_obj);
            });
        };

        var col_model_default = [
            { label: 'Ter.Id', name: "grid_id", key: true, width: "40px", fixed: true },
            { label: '<span lang="en">Terrain Name</span><span lang="ru">Название территории</span>', name: "terrain_name", width: "150px", fixed: true },
        ];
        obj.grid_colModel_default = col_model_default;
        obj.grid_colModel = JSON.parse(JSON.stringify(col_model_default));
        obj.non_researchable = true;
        TerrainTable = obj;
        Objects.push(obj);
    }

    {
        Weapons = {
            sysid: "Weapon",
            page_url: "weapons.html",
            path_json: data_directory + "weapons.json",
            LoadDataFunction: LoadDataObject,
            LoadLeftGridFunction: function () {
                var data_obj = this;
                data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
            },
            icon_folder: "Weapon",
            GetIconHtml_Function: function (rowObject, size) {
                return GetIcon_element(this.icon_folder, rowObject, size);
            },
            grid_colModel: [
                { label: "ID", name: "grid_id", key: true, width: "80px", hidden:true },
                { label: '<span lang="en">Name</span><span lang="ru">Название</span>', name: "name", formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>'}, },
            
                { label: '<span lang="en">Research Line</span><span lang="ru">Линия исследований</span>', name: "weaponSubClass" },
                { label: '<span lang="en">Price</span><span lang="ru">Цена</span>', name: "buildPower", width: 45, formatter: function (cellvalue, options, rowObject) { return '$' + cellvalue }, sorttype: "int" },
                { label: '<span lang="en">Range (tiles)</span><span lang="ru">Дальность (в тайлах)</span>', name: "longRange", sorttype: "int", formatter: function (cellvalue, options, rowObject) { return (cellvalue / 128).toFixed(1) }, width: 40 },
                {
                    label: '<span lang="en">Damage *</span><span lang="ru">Урон *</span>', sortable: false,
                    formatter: function (cellvalue, options, rowObject) {
                        var html_res = "";
                        if (rowObject.damage != undefined) {

                            if (rowObject.weaponClass == "HEAT") {
                                html_res += "<label style='color: darkred'><b>" + rowObject.damage + "</b></label>";
                                html_res += " (" + '<span lang="en">heat</span><span lang="ru">огнен.</span>' + ")";
                            } else {
                                html_res += "<b>" + rowObject.damage + '</b> <span lang="en">(kinetic)</span><span lang="ru">(кинетич.)</span>';
                            }
                        }
                    
                        if (rowObject.radiusDamage != undefined && rowObject.radius != undefined) {
                            html_res += "</br>";
                        
                            if (rowObject.weaponClass == "HEAT") {
                                html_res += "<label style='color: darkred'><b>" + rowObject.radiusDamage + "</b></label> /" + (rowObject.radius / 128).toFixed(1) + " tiles";
                                html_res += " (" + '<span lang="en">heat</span><span lang="ru">огнен.</span>' + ")";
                            } else {
                                html_res += "<b>" + rowObject.radiusDamage + " /" + (rowObject.radius / 128).toFixed(1) + ' <span lang="en">tiles</span><span lang="ru">тайлов</span></b>';
                            }
                        }
                    
                        if (rowObject.periodicalDamage != undefined && rowObject.periodicalDamageRadius != undefined && rowObject.periodicalDamageTime != undefined) {
                            html_res += "</br>";
                            if (rowObject.periodicalDamageWeaponClass == "HEAT") {
                                html_res += "<label style='color: darkred'><b>" + rowObject.periodicalDamage + '</label></b> <span lang="en">/sec</span><span lang="ru">/сек</span>' + "";
                                html_res += " (" + rowObject.periodicalDamageWeaponClass.toLowerCase() + ")";
                            } else {
                                html_res += "<b>" + rowObject.periodicalDamage + ' <span lang="en">/sec</span><span lang="ru">/сек</span>' + "</b>";
                            }
                        }
                        return html_res;
                    }, width: 130
                },
                {
                    label: '<span lang="en">Rate of Fire</span><span lang="ru">Скорострельность</span>', sortable: false,
                    formatter: function (cellvalue, options, rowObject) { return Weapon_ShotsPerMinute(rowObject).toFixed(1) + ' <span lang="en">/min</span><span lang="ru">/мин</span>';}, width: 70,//
                    sorttype: function (cell,rowObject) {
                        return parseInt(cell);//Math.ceil(Weapon_ShotsPerMinute(rowObject));
                    }
                },
                { label: '<span lang="en">Damage</br>modifier</span><span lang="ru">Тип урона</br>(модификатор урона)</span>', name: "weaponEffect", width: 50, formatter: function (cellvalue, options, rowObject) { return "<label style='font-size:0.7em'>" + cellvalue + "</label>" }, },
            ],
            //obj.groupField = "weaponEffect";
            groupingView: {
                groupField: ['weaponSubClass'],
                groupColumnShow: [false],
                groupText: ['<b>{0}</b>'],
                groupCollapse: false,
                groupOrder: ['asc'],
            },
        };
        Objects.push(Weapons);
    }

    {
        Bodies = {
            sysid: "Body",
            page_url: "Body.html",
            path_json: data_directory + "body.json",
            LoadDataFunction: LoadDataObject,
            LoadLeftGridFunction: function () {
                var data_obj = this;
                data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
            },
            icon_folder: "Body",
            GetIconHtml_Function: function (rowObject, size) {
                return GetIcon_element(this.icon_folder, rowObject, size);
            },
            grid_colModel: [
                { label: "ID", name: "grid_id", key: true, width: "80px", hidden: true },
                { label: '<span lang="en">Name</span><span lang="ru">Название</span>', name: "name", formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>'}, },
                { label: "<span lang='en'>Size</span><span lang='ru'>Размер</span>", name: "size", width: 60 },
                { label: "<span lang='en'>Price</span><span lang='ru'>Цена</span>", name: "buildPower", width: 60, formatter: function (cellvalue, options, rowObject) { return '$' + cellvalue }, sorttype: "int" },
                { label: "<span lang='en'>Hit Points</span><span lang='ru'>Очки жизни (HP)</span>", name: "hitpoints", width: 60 },
                { label: "<span lang='en'>Armor Kineric</span><span lang='ru'>Броня кинетич.</span>", name: "armourKinetic", width: 60 },
                { label: "<span lang='en'>Armor Thermal</span><span lang='ru'>Броня огнен.</span>", name: "armourHeat", width: 60 },
            ],
            groupingView: {
                groupField: ['size'],
                groupColumnShow: [false],
                groupText: ['<div class="ui-widget-header ui-corner-top" style="padding:2px; margin-top:16px; font-size:1.1em" ><b>{0}</b></div>'],
                groupCollapse: false,
                groupOrder: ['asc'],
                groupDataSorted: true,
            },
        }
        Objects.push(Bodies);
    }

    {
        Propulsion = {
            sysid: "Propulsion",
            page_url: "propulsion.html",
            path_json: data_directory + "propulsion.json",
            LoadDataFunction: LoadDataObject,
            icon_folder: "Propulsion",
            GetIconHtml_Function: function (rowObject, size) {
                return GetIcon_element(this.icon_folder, rowObject, size);
            },
            LoadLeftGridFunction: function () {
                var data_obj = this;
                data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
            },
            grid_colModel: [
                { label: "ID", name: "grid_id", key: true, width: "80px", hidden: true },
                { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name", width: 90, formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>' }, },
                {
                    label: "<span lang='en'>Max Speed</span><span lang='ru'>Макс. скорость</span>", name: "speed", sorttype: "int",
                    formatter: function (cellvalue, options, rowObject) {
                        return (cellvalue / 128).toFixed(2)
                    }, width: 60
                },
                {
                    label: "Engine power %", name: "buildPower",
                    formatter: function (cellvalue, options, rowObject) {
                        if (PropulsionType.loaded_data != undefined) {
                            return PropulsionType.loaded_data_hash[rowObject.type].multiplier + '%';
                        }
                    },
                    sorttype: "int", width:60
                },
                { label: "<span lang='en'>Price %</span><span lang='ru'>Стоимость %</span>", name: "buildPower", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
                { label: "<span lang='en'>Build time %</span><span lang='ru'>Время производства %</span>", name: "buildPoints", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
                { label: "<span lang='en'>Hit Points %</span><span lang='ru'>Очки жизни (HP) %</span>", name: "hitpoints", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
                { label: "<span lang='en'>Weight %</span><span lang='ru'>Вес %</span>", name: "weight", formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' }, sorttype: "int", width: 60 },
            ],
        };
        Objects.push(Propulsion);
    }

    {
        var obj = new Object;
        obj.sysid = "Structure";
        obj.page_url = "structure.html";
        obj.path_json = data_directory + "structure.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.icon_folder = "Structures";
        obj.GetIconHtml_Function = function (rowObject, size) {
            return GetIcon_element(this.icon_folder, rowObject, size);
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, width: "80px", hidden: true },
            { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name", formatter: function (cellvalue, options, rowObject) { return '<b>' + cellvalue + '</b>' }, },
            { label: "<span lang='en'>Class</span><span lang='ru'>Класс</span>", name: "strength" },
            { label: "<span lang='en'>Price</span><span lang='ru'>Цена</span>", name: "buildPower", width: 45, formatter: function (cellvalue, options, rowObject) { return '$' + cellvalue }, sorttype: "int" },
            { label: "<span lang='en'>Build time</span><span lang='ru'>Время постройки</span>", name: "buildPoints", width: 45, sorttype: "int" },
            { label: "<span lang='en'>Hit points</span><span lang='ru'>Очки жизни (HP)</span>", name: "hitpoints", width: 45, sorttype: "int" },
            { label: "<span lang='en'>Armor kinetic</span><span lang='ru'>Броня кинетич.</span>", name: "armour", width: 45, sorttype: "int" },
            { label: "<span lang='en'>Armor thermal</span><span lang='ru'>Броня огнен.</span>", name: "armour", width: 45, sorttype: "int" },
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
        obj.path_json = data_directory + "weaponmodifier.json";
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
                DrawGrid(data_obj, container_id, null);
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
                label: "<span lang='en'>Weapon Class</span><span lang='ru'>Класс орудия</span>", name: "grid_id", key: true, width: 110, fixed: true,
                formatter: function (cellvalue, options, rowObject) {
                    return "<div style='font-size:0.9em'><b>" + cellvalue + "</b></div>";
                },
            },
            {
                label: "<span lang='en'>Weapons</span><span lang='ru'>Орудия</span>", name: "Weapons", width: '530px',
                formatter: formatter_weapon_icons,
            },
            {
                label: "<span lang='en'>Half-Tracked</span><span lang='ru'>Полугусеницы</span>", name: "Half-Tracked", width: '80px',
                formatter: formatter_modifier
            },
            {
                label: "<span lang='en'>Wheeled</span><span lang='ru'>Колеса</span>", name: "Wheeled", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "<span lang='en'>Tracked</span><span lang='ru'>Гусеницы</span>", name: "Tracked", width: '80px',
                formatter: formatter_modifier, 
            },
            {
                label: "<span lang='en'>Hover</span><span lang='ru'>Воздушная подушка</span>", name: "Hover", width: '80px',
                formatter: formatter_modifier, 
            },
            {
                label: "<span lang='en'>Cyborgs</span><span lang='ru'>Киборги</span>", name: "Legged", width: '80px',
                formatter: formatter_modifier, 
            },
            {
                label: "<span lang='en'>VTOL</span><span lang='ru'>СВВП (VTOL)</span>", name: "Lift", width: '80px',
                formatter: formatter_modifier, 
            },
        ];
        PropulsionModifiers = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "WeaponStructureModifiers";
        obj.path_json = data_directory + "structuremodifier.json";
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
                label: "Weapon Class", name: "grid_id", key: true, width: 110, fixed:true,
                formatter: function (cellvalue, options, rowObject) {
                    return "<div style='font-size:0.9em'><b>" + cellvalue + "</b></div>";
                },
            },
            {
                label: "<span lang='en'>Weapons</span><span lang='ru'>Орудия</span>", name: "Weapons", width: '580px',
                formatter: formatter_weapon_icons,
            },
            {
                label: "<span lang='en'>SOFT</span><span lang='ru'>Слабая (SOFT)</span>", name: "SOFT", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "<span lang='en'>MEDIUM</span><span lang='ru'>Средняя (MEDIUM)</span", name: "MEDIUM", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "<span lang='en'>HARD</span><span lang='ru'>Укрепленная (HARD)</span", name: "HARD", width: '80px',
                formatter: formatter_modifier,
            },
            {
                label: "<span lang='en'>BUNKER</span><span lang='ru'>Бункер</span", name: "BUNKER", width: '80px',
                formatter: formatter_modifier,
            },
        ];
        StructureModifiers = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Research";
        obj.path_json = data_directory + "research.json";
        obj.LoadDataFunction = LoadResearch;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            {
                label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name", formatter: function (cellvalue, options, rowObject) {
                    return '<b>' + cellvalue + '</b>';
                },
                width: 350,
            },
            {
                label: "<span lang='en'>Price</span><span lang='ru'>Цена</span>", name: "researchPower", formatter: function (cellvalue, options, rowObject) {
                    return '$' + cellvalue;
                },
                width: 50,
            },
        ];
        Researches = obj;
        obj.icon_folder = "Research";
        obj.GetIconHtml_Function = function (rowObject, size) {
            var img_src = GetResearchIcon_src(rowObject.grid_id, rowObject.name);
            if (img_src)
            {
                return GetIcon_useSrc(img_src, rowObject, size)
            } else
            {
                return EmptyComponentIcon_html(rowObject.name);
            }
        };

        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Repair";
        obj.path_json = data_directory + "repair.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.icon_folder = "SupportTurrets";
        obj.GetIconHtml_Function = function (rowObject, size) {
            return GetIcon_element(this.icon_folder, rowObject, size);
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name" },
            { label: "<span lang='en'>repairPoints</span><span lang='ru'>Очки ремонта</span>", name: "repairPoints" },
            { label: "<span lang='en'>Hit points</span><span lang='ru'>Очки жизни (HP)</span>", name: "hitpoints", width: 45, sorttype: "int" },
        ];
        Repair = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Construction";
        obj.path_json = data_directory + "construction.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name" },
            { label: "<span lang='en'>Power of build ray</span><span lang='ru'>Очки строительства</span>", name: "buildPoints" },
            { label: "<span lang='en'>Price</span><span lang='ru'>Цена</span>", name: "buildPower" },
            { label: "<span lang='en'>Hit points</span><span lang='ru'>Очки жизни (HP)</span>", name: "hitpoints", width: 45, sorttype: "int" },
        ];
        obj.icon_folder = "SupportTurrets";
        obj.GetIconHtml_Function = function (rowObject, size) {
            return GetIcon_element(this.icon_folder, rowObject, size);
        };

        Construction = obj;
        Objects.push(obj);
    }

    {
        Sensor = {
            sysid: "Sensor",
            path_json: data_directory + "sensor.json",
            LoadDataFunction: LoadDataObject,
            LoadLeftGridFunction: function () {
                var data_obj = this;
                data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
            },
            grid_colModel: [
                { label: "ID", name: "grid_id", key: true, hidden: true },
                { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name" },
                { label: "<span lang='en'>Range</span><span lang='ru'>Дальность</span>", name: "range" },
                { label: "<span lang='en'>Price</span><span lang='ru'>Цена</span>", name: "buildPower" },
                { label: "<span lang='en'>Hit points</span><span lang='ru'>Очки жизни (HP)</span>", name: "hitpoints", width: 45, sorttype: "int" },
            ],
            icon_folder: "SupportTurrets",
            GetIconHtml_Function: function (rowObject, size) {
                return GetIcon_element(this.icon_folder, rowObject, size);
            },
        };
        Objects.push(Sensor);
    }

    {
        var obj = new Object;
        obj.sysid = "ECM";
        obj.path_json = data_directory + "ecm.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name" },
            { label: "<span lang='en'>Range</span><span lang='ru'>Дальность</span>", name: "range" },
        ];
        obj.icon_folder = "SupportTurrets";
        obj.GetIconHtml_Function = function (rowObject, size) {
            return GetIcon_element(this.icon_folder, rowObject, size);
        };
        ECM = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Features";
        obj.path_json = data_directory + "features.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name" },
            { label: "<span lang='en'>Armour</span><span lang='ru'>Броня</span>", name: "armour" },
            { label: "<span lang='en'>Hit points</span><span lang='ru'>Очки жизни (HP)</span>", name: "hitpoints" },
        ];
        obj.non_researchable = true;
        Features = obj;
        Objects.push(obj);
    }

    {
        var obj = new Object;
        obj.sysid = "Templates";
        obj.path_json = data_directory + "templates.json";
        obj.LoadDataFunction = LoadDataObject;
        obj.LoadLeftGridFunction = function () {
            var data_obj = this;
            data_obj.LoadDataFunction(data_obj, function () { DrawLeftGrid(data_obj); });
        };
        obj.grid_colModel = [
            { label: "ID", name: "grid_id", key: true, hidden: true },
            { label: "<span lang='en'>Name</span><span lang='ru'>Название</span>", name: "name", width: 160, fixed: true },
            //{ label: "Type", name: "type", width: 50, fixed: true },
            {
                label: "<span lang='en'>Body</span><span lang='ru'>Корпус</span>", name: "body", width: 80, fixed: true,
                formatter: function (cellvalue, options, rowObject) {
                    if (Bodies.loaded_data_hash[cellvalue] != undefined) {
                        return Bodies.loaded_data_hash[cellvalue].name;
                    } else {
                        return cellvalue;
                    }
                },
            },
            {
                label: "<span lang='en'>Propulsion</span><span lang='ru'>Ходовая</span>", name: "propulsion", width: 100, fixed: true,
                formatter: function (cellvalue, options, rowObject) {
                    if (Propulsion.loaded_data_hash[cellvalue] != undefined) {
                        return Propulsion.loaded_data_hash[cellvalue].name;
                    } else {
                        return cellvalue;
                    }
                },
            },
            
            {
                label: "<span lang='en'>Weapons</span><span lang='ru'>Орудия</span>", name: "weapons", width: 200, fixed: true,
                formatter: function (cellvalue, options, rowObject) {
                    if (cellvalue == undefined) {
                        return '';
                    }
                    var weaps = cellvalue;
                    var result = [];
                    for (var i in weaps) {
                        if (Weapons.loaded_data_hash[cellvalue] != undefined) {
                            result.push(Weapons.loaded_data_hash[cellvalue].name);
                        } else {
                            result.push(cellvalue);
                        }
                    }
                    return result.toString();
                },
            },
        ];

        obj.GetIconHtml_Function = function (rowObject, size) {
            //...this code use to draw cyborgs icons at Cyborgs.html
            if (GetIcon_TryGetIcon("Cyborgs", rowObject))
            {
                return GetIcon_element("Cyborgs", rowObject, size);
            }
            else 
            {
                if (rowObject.type == "CYBORG" || rowObject.type == "CYBORG_SUPER") {
                    var weap_id = rowObject.weapons[0];
                    if (Weapons.loaded_data_hash[weap_id])
                    {
                        return GetIcon_element(Weapons.icon_folder, Weapons.loaded_data_hash[weap_id], size);
                    }
                } else if (rowObject.type == "CYBORG_CONSTRUCT") {
                    var constr_id = rowObject.construct;
                    var comp = Construction.loaded_data_hash[constr_id];
                    if (comp)
                    {
                        return GetIcon_element(Construction.icon_folder, comp, size);
                    }
                }else if (rowObject.type == "CYBORG_REPAIR") {
                    var repair_id = rowObject.repair;
                    var comp = Repair.loaded_data_hash[repair_id];
                    if (comp) {
                        return GetIcon_element(Repair.icon_folder, comp, size);
                    }
                }
            }
            return EmptyComponentIcon_html(rowObject.name);
        };

        Templates = obj;
        Objects.push(obj); 
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
    return null;
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
    var finalColModel = [];
    var selected_columns = GetSelectedColumns(DataObject);
    if (selected_columns == null) {
        selected_columns = {};
        for (var i in DataObject.grid_colModel) {
            selected_columns[DataObject.grid_colModel[i].name] = 1;
        }
        localStorage[DataObject.sysid + "_SelectedColumns"] = JSON.stringify(selected_columns);
    };
    //first - push columns from data model in given order
    var pushed_cols = {};
    for (var i in DataObject.grid_colModel) {
        var colName = DataObject.grid_colModel[i].name;
        if (selected_columns[colName] != undefined || DataObject.grid_colModel[i].hidden == true) { //hidden columns should be in table always
            finalColModel.push(DataObject.grid_colModel[i]);
            pushed_cols[colName] = 1;
        }
    }
    //second - push selected columns which were not included in DataObject.grid_colModel
    for (var i = 0; i < DataObject.all_columns.length; i++) {
        var colName = DataObject.all_columns[i].name;
        if (selected_columns[colName] != undefined && pushed_cols[colName]==undefined) {
            finalColModel.push(DataObject.all_columns[i]);
        }
    }

    /* draw grid method */
    var grid_element_id = ResetGridContainer(container_id, true);
    var grid_toolbar_id = grid_element_id + "_toolbar";
    if (container_height != undefined) {
        $("#" + container_id).height(container_height);
    } else {
        $("#" + container_id).css("height", "700px");
       // $("#" + container_id).height(Math.max($(window).height() - $("#" + container_id).offset().top - 39,500));
    }
    if (container_width != undefined) {
        $("#" + container_id).width(container_width);
    }
    var grid = $(grid_element_id);
    if (DataObject.GetIconHtml_Function != undefined) {

        finalColModel = [{
            label: "<span lang='en'>pic</span><span lang='ru'>иконка</span>",
            name: "pic",
            width: '65px',
            sortable: false,
            search: false,
            formatter: function (cellvalue, options, rowObject) {
                return DataObject.GetIconHtml_Function(rowObject);
            }
        }].concat(finalColModel);
    }

    /* Check - group columns shoul be selected/pushed to final column model */
    var groupEnabled = false;
    if (DataObject.groupingView != undefined) {
        if (DataObject.groupingView.groupField != undefined) {
            groupEnabled = true;
            for (var f in DataObject.groupingView.groupField) {
                var fieldName = DataObject.groupingView.groupField[f];
                if (pushed_cols[fieldName] == undefined) {
                    groupEnabled = false;
                    break;
                }
            }
        }
    }
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        //height: "100%",
        height: Math.max($("#" + container_id).height() - 120, 400),
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
        recordtext: "<span lang='en'>records</span><span lang='ru'>записей</span>: {2}",
        ignoreCase: true, //make search case insensitive
        grouping: DataObject.groupingView != undefined,
        groupingView: groupEnabled ? DataObject.groupingView : undefined,
        scrollrows: true,
    });

    myAddButton = function (options) {
        grid.jqGrid('navButtonAdd', grid_toolbar_id, options);
        grid.jqGrid('navButtonAdd', '#' + grid[0].id + "_toppager", options);
    };

    grid.jqGrid('navGrid', grid_toolbar_id, { view: true, edit: false, add: false, del: false, search: true, refresh: false, cloneToTop: true });

    myAddButton({
        caption: "<span lang='en'>Choose columns</span><span lang='ru'>Выбор колонок</span>",
        title: "<span lang='en'>Hide/Show additional columns</span><span lang='ru'>Показать/спрятать дополнительные колонки</span>",
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
                    DataObject.loaded_data[i].results_string = "";
                } else {
                    DataObject.loaded_data[i].results_string = JSON.stringify(DataObject.loaded_data[i].results);
                    DataObject.loaded_data[i].results = DataObject.loaded_data[i].results;
                }

            }
        }
        DataObject.FirstLoad_Tmp = true;
        callback_function();
    });
}

var readfile;
function LoadDataObject(DataObject, callback_function) {
    var do_translate_names = typeof po_Translate != "undefined";

    if (DataObject.loaded_data == undefined) {

        var method_process_loaded_data = function (DataObject, readfile, callback_function) {
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
                
                if (data_row.name) {
                    data_row.nameKey = data_row.name;
                }
                if (do_translate_names && data_row.name != undefined)
                {
                    if (po_Translate[data_row.name] != undefined) {
                        data_row.name = po_Translate[data_row.name][0];
                    }
                }
            }
            DataObject.all_columns = grid_columns;
            DataObject.loaded_data = grid_data;
            if (callback_function != undefined) {
                callback_function();
            }
        }

        if (localStorage[DataObject.sysid + "_loaded_data"] != undefined) {
            var stats_data = JSON.parse(localStorage[DataObject.sysid + "_loaded_data"]);
            method_process_loaded_data(DataObject, stats_data, callback_function);
        }
        else {
            /* retrievind data from server */
            var get_data_url;
            if (DataObject.path_ini)
            {
                get_data_url = "stuff.php";
            } else
            {
                get_data_url = DataObject.path_json;
            }
            ShowLoading('tabs_left');
            $.ajax({
                url: get_data_url,
                data: { url: DataObject.path_ini },
                datatype: "json",
                success: function (msg) {
                    var stats_data;
                    if (typeof msg == "string") //temporary solution. TODO: remove this after full porting to json stats
                    {
                        stats_data = JSON.parse(msg);
                        localStorage[DataObject.sysid + "_loaded_data"] = msg;
                    } else
                    {
                        stats_data = msg;
                        localStorage[DataObject.sysid + "_loaded_data"] = JSON.stringify(msg); 
                    }
                    method_process_loaded_data(DataObject, stats_data, callback_function);
                    HideLoading('tabs_left');
                },
                error: function (msg) {
                    HideLoading('tabs_left');
                    alert("Error happened. Please try to reload page.");
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
                { label: "<span lang='en'>Name</span><span lang='ru'>Наименование</span>", name: "id", key: true, width: "120", fixed: true },
                { label: "<span lang='en'>Value</span><span lang='ru'>Значение</span>", name: "value" },
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

    //var hidden_cols = {};
    //for (var i in DataObject.grid_colModel) {
    //    if (DataObject.grid_colModel[i].hidden == true) {
    //        hidden_cols[DataObject.grid_colModel[i].name] = 1;
    //    }
    //}

    var selected_columns = GetSelectedColumns(DataObject);
    for(var i in DataObject.all_columns)
    {
        var colName = DataObject.all_columns[i].name;
        DataObject.all_columns[i].col_visible = selected_columns[colName] != undefined;
    }


    var grid_data = DataObject.all_columns;

    LeftRootsBox_OpenedDialog = $("#dialog_grid").dialog(
    {
        title: "<span lang='en'>Choose your columns</span><span lang='ru'>Включите или отключите показ колонок по вашем вкусу</span>",
        buttons:
        {
            "Save": function () {
                var selected_columns = {};
                var sel_cnt = 0;
                for (var i = 0; i < grid_data.length; i++) {
                    var rowData = grid.jqGrid('getRowData', grid_data[i].name);
                    if (rowData.col_visible == "True") {
                        selected_columns[grid_data[i].name] = 1;
                        sel_cnt++;
                    }
                }
                if (sel_cnt == 0) {
                    alert("<span lang='en'>Please select 1 column at least.</span><span lang='ru'>Вы должны выбрать хотя бы одну колонку.</span>");
                } else {
                    localStorage[DataObject.sysid + "_SelectedColumns"] = JSON.stringify(selected_columns);
                    DrawLeftGrid(DataObject);
                    $(this).dialog('close');
                }
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
                { label: "<span lang='en'>System Name</span><span lang='ru'>Системное имя</span>", name: "name", key: true, width: 100 },
                { label: "<span lang='en'>Name</span><span lang='ru'>Наименование</span>", name: "label", width: 150 },
                { label: "<span lang='en'>Description</span><span lang='ru'>Описание</span>", name: "col_descr", width: 150 },
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

function DrawPageHeader() {

    var html = '\
            <div style="text-align:center;">\
            <div class="ui-corner-top" style="margin-bottom:-5px;width:100%; height:185px;background:url(\'./Styles/wz2100netbanner.jpg\') no-repeat left top #ffffff; color: #FFFFFF">\
                <img src="./Styles/wz2100netlogo.png" width="186" height="86" alt="" title="" style="margin-top:10px"/>\
            </div>\
            </div>\
    \
    ';

    html += '\
        \
<div class="nav ui-widget ui-corner-bottom" style=";margin-top:-25px;margin-bottom:10px;">\
                	<div class="fl">\
                    	<ul>\
							    <li class=""><a href="http://wz2100.net">FrontPage (News)</a></li>\
							    <li class=""><a href="http://developer.wz2100.net">Wiki/trac</a></li>\
                                <li class="current"><a href="http://betaguide.wz2100.net/">Guide</a></li>\
							    <li class=""><a href="http://addons.wz2100.net">Addons</a></li>\
                                <li class=""><a href="http://developer.wz2100.net/wiki/NewFAQ">FAQ</a></li>\
							    <li class=""><a href="http://donations.wz2100.net">Donate</a></li>\
							    <li class=""><a href="http://forums.wz2100.net/index.php">Forum</a></li>\
                            \
                            	<li><a href="./search.php">Search</a></li>\
                            \
                        </ul>\
                    </div>\
                    <div class="fr">\
                    	<ul>\
                            \
                                	<li>\
                                        <form action="http://forums.wz2100.net/search.php" method="get" id="search">\
                                            <span lang="en">\
                                                <input name="keywords" type="text" maxlength="128" title="Search for keywords" class="quicksearch" value="Search…" onclick="if(this.value==\'Search…\')this.value=\'\';" onblur="if(this.value==\'\')this.value=\'Search…\';">\
                                            </span>\
                                            <span lang="ru">\
                                                <input name="keywords" type="text" maxlength="128" title="Поиск по ключевым словам" class="quicksearch" value="Поиск…" onclick="if(this.value==\'Поиск…\')this.value=\'\';" onblur="if(this.value==\'\')this.value=\'Поиск…\';">\
                                            </span>\
                                            \
                                        </form>\
                                    </li>\
                                \
                        </ul>\
                    </div>\
                </div>';

    html += '\
        \
<div class="ui-widget ui-widget-content ui-corner-top" style="margin-bottom:-4px;" >\
        \
        \
        			<ul class="navmenu2">\
        				<li><a href="index.html" accesskey="h"><span class="ui-icon ui-icon-home" style="display:inline-block"></span>\
                                <span lang="en">Guide index</span>\
                                <span lang="ru">Начало</span>\
                        </a> </li>\
        				<li><a href="weapons.html">\
                                <span lang="en">Weapons</span>\
                                <span lang="ru">Орудия</span>\
                        </a> </li>\
        				<li><a href="Body.html">\
                                <span lang="en">Bodies</span>\
                                <span lang="ru">Корпуса</span>\
                        </a> </li>\
                        <li><a href="propulsion.html">\
                                <span lang="en">Propulsion</span>\
                                <span lang="ru">Ходовая</span>\
                        </a> </li>\
                        <li><a href="cyborgs.html">\
                                <span lang="en">Cyborgs</span>\
                                <span lang="ru">Киборги</span>\
                        </a> </li>\
                        <li><a href="structure.html">\
                                <span lang="en">Buildings</span>\
                                <span lang="ru">Постройки</span>\
                        </a> </li>\
                        <li><a href="Research.html">\
                                <span lang="en">Research</span>\
                                <span lang="ru">Исследования</span>\
                        </a> </li>\
                        <li><a href="stats.html"><span class="ui-icon ui-icon-calculator" style="display:inline-block"></span>\
                                <span lang="en">Database</span>\
                                <span lang="ru">База параметров</span>\
                        </a></li>\
                        <li><a href="design.html"><span class="ui-icon ui-icon-star" style="display:inline-block"></span>\
                                <span lang="en">Unit designer</span>\
                                <span lang="ru">Дизайн танков</span>\
                            </a> </li>\
                        <li>\
                            <span style="float:right">\
                                <span lang="en">Language:</span>\
                                <span lang="ru">Выберите язык:</span>\
                            <select id="lang_select" onchange="languageChange(this.value)">\
                                <option value="en">English (en)</option>\
                                <option value="ru">Русский (ru)</option>\
                            </select>              \
                            </span>\
                        </li>\
        </ul>\
        				\
\
\
\
        \
        			\
        \
        \
        			\
        		</div>\
\
    ';

    var elm = $('#page_header');
    if (elm.length > 0) {
        elm.html(html);
    }
}

function languageChange(lang_tag) {
    var new_loc = language_urls[lang_tag];
    window.location.href = new_loc;
    //var keep_site_version = localStorage["site_version"];
    //localStorage.clear(); //stats should be reloaded with translated names
    //localStorage["lang"] = lang_tag;
    //localStorage["site_version"] = keep_site_version;
    //location.reload();
}

/* dynamically load script */
function require(url) {
    var ajax = new XMLHttpRequest();
    ajax.open('GET', url, false); // <-- the 'false' makes it synchronous
    ajax.onreadystatechange = function () {
        var script = ajax.response || ajax.responseText;
        if (ajax.readyState === 4) {
            switch (ajax.status) {
                case 200:
                    eval.apply(window, [script]);
                    console.log("script loaded: ", url);
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
    };
    ajax.send(null);
}


function SetSiteLanguage()
{
    if (localStorage["lang"] == undefined)
    {
        localStorage["lang"] = "en";
    }
    if (localStorage["lang"] != "en") {
        require('/data_master/namestxt_translated.js');
        //$('head').append('<script type="text/javascript" src="data_master/namestxt_translated.js"></script>');
    }
    var lang_tag = localStorage["lang"];

    var lang_css_list = {
            en: '\
            span[lang = "en"]\
            {\
                /*display: none !important;*/\
            }\
            span[lang = "ru"]\
            {\
                display: none !important;\
            }   \
        ',
            ru: '\
            span[lang = "en"]\
            {\
                display: none !important;\
            }\
            span[lang = "ru"]\
            {\
                /*display: none !important;*/\
            }   \
            '
    };
    var lang_css_str = "";
    if (lang_css_list[lang_tag] == undefined)
    {
        localStorage["lang"] = "en";
        lang_css_str = lang_css_list["en"];
    } else
    {
        lang_css_str = lang_css_list[lang_tag];
    }

    $("#lang_css").html(lang_css_str);
}

function DrawPageCaption() {
    var elm = $('#page_caption');
    if (elm.length > 0) {
        //elm.addClass("ui-widget");
        //elm.addClass("ui-corner-top");
        var html = '\
        <div class="ui-accordion ui-widget ui-helper-reset ui-corner-top">\
            <h3 style="text-align:left; font-size:1.1em;margin-bottom:-10px;padding-bottom:10px;background:rgba(255,255,255,0.70)" class="ui-accordion-header ui-helper-reset ui-state-active ui-accordion-icons ui-accordion-header-active">\
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
    var slider_elem = $('<label for="' + input_id + '"><span lang="en">Research time:</span><span lang="ru">Время исследований:</span></label><input type="text" id="' + input_id + '" style="border: 0; font-weight: bold;" /><div id="' + slider_id + '"></div>');
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
    </div>\
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

function FindDataObject(grid_id) {
    for (var i in Objects) {
        if (Objects[i].loaded_data_hash != undefined) {
            if (Objects[i].loaded_data_hash[grid_id] != undefined) {
                return Objects[i];
            }
        }
    }
    return null;
}

function FindObjectById(id)
{
    for (var i in Objects) {
        if (Objects[i].loaded_data_hash != undefined) {
            var comp = Objects[i].loaded_data_hash[id];
            if (comp) {
                return {
                    dataObject: Objects[i],
                    row: comp,
                };
            }
        }
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

function DrawDamageModifiersTable(container_id) {

    var grid_data_hash = {};
    var grid_col_hash = {};
    var grid_col_model = [{ name: "prop_struc_type", label: ' ', key: true }];
    

    var set_method = function (weap_type, modif_object) {
        if (grid_col_hash[weap_type] == undefined) {
            var new_col = {
                name: weap_type
            };
            grid_col_hash[weap_type] = 1;
            grid_col_model.push(new_col);
        }

        for (var prop_struc_type in modif_object.loaded_data_hash[weap_type]) {
            if (grid_data_hash[prop_struc_type] == undefined) {
                grid_data_hash[prop_struc_type] = {};
                grid_data_hash[prop_struc_type]["prop_struc_type"] = prop_struc_type;
            }
            grid_data_hash[prop_struc_type][weap_type] = modif_object.loaded_data_hash[weap_type][prop_struc_type] + '%';
        }
    }

    for (var weap_type in PropulsionModifiers.loaded_data_hash) {
        set_method(weap_type, PropulsionModifiers);
    }

    for (var weap_type in StructureModifiers.loaded_data_hash) {
        set_method(weap_type, StructureModifiers);
    }

    $('#' + container_id).append('<div id="' + container_id + '_1"></div><div id="' + container_id + '_2"></div>');

    var prop_types_hash = {};
    for (var prop_type in PropulsionType.loaded_data_hash) {
        if (prop_types_hash[prop_type] == undefined) {
            prop_types_hash[prop_type] = 1;
        }
    }
    var grid_data = [];
    for (var prop_struc_type in grid_data_hash) {
        if (prop_types_hash[prop_struc_type] != undefined)
        {
            grid_data.push(grid_data_hash[prop_struc_type])
        }
    }
    var grid = $(ResetGridContainer(container_id + '_1'));
    grid.jqGrid
    ({
        caption: '<span lang="en">Weapon to Propulsion damage modifiers</span><span lang="ru">Модификаторы урона орудий по типам ходовой</span>',
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: "auto",
        colModel: grid_col_model,
    });


    var grid_data = [];
    var struc_types_hash = {};
    for (var struc_id in Structures.loaded_data_hash) {
        var struc_type = Structures.loaded_data_hash[struc_id].strength;
        if (struc_type != undefined) {
            if (struc_types_hash[struc_type] == undefined) {
                struc_types_hash[struc_type] = 1;
            }
        }
    }

    for (var prop_struc_type in grid_data_hash) {
        if (struc_types_hash[prop_struc_type] != undefined) {
            grid_data.push(grid_data_hash[prop_struc_type])
        }
    }

    var grid = $(ResetGridContainer(container_id + '_2'));
    grid.jqGrid
    ({
        caption: '<span lang="en">Weapon to Structure damage modifiers</span><span lang="ru">Модификаторы урона орудий по типам построек</span>',
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: "auto",
        colModel: grid_col_model,
    });

}

function GetIcon_filename( grid_id) {
    return grid_id + ".gif";

}

function GetIcon_src(folder, grid_id) {
    var img_name = GetIcon_filename(grid_id);
    return "data_icons/" + folder + "/" + img_name;
}


function GetIcon_CheckIconFilenameHashed(icon_folder, img_name) {
    if (typeof icon_files_hash != 'undefined') {
        if (icon_files_hash["\\" + icon_folder + "\\" + img_name] == undefined) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function GetIcon_TryGetIcon(folder, rowObject)
{
    var img_name1 = GetIcon_filename(rowObject.nameKey);
    var img_name2 = GetIcon_filename(rowObject.grid_id);
    if (GetIcon_CheckIconFilenameHashed(folder, img_name1) == true) {
        /* Method 1 - try get icon by component id */
        return GetIcon_src(folder, rowObject.nameKey);
    } else if (GetIcon_CheckIconFilenameHashed(folder, img_name2) == true) {
        /* Method 1 - try get icon by component name */
        return GetIcon_src(folder, rowObject.grid_id);
    }
    else {
        return null;
    }
}

function GetIcon_element(folder, rowObject, size) {
    var img_src = GetIcon_TryGetIcon(folder, rowObject);
    if (img_src)
    {
        return GetIcon_useSrc(img_src, rowObject, size);
    } else
    {
        return EmptyComponentIcon_html(rowObject.name, img_src);
    }
}

function GetIcon_useSrc(img_src, rowObject, size)
{
    if (size == undefined) {
        return '<img src="' + img_src + '" onerror="$(this).hide();" title="' + rowObject.name + '" style="vertical-align:middle"/>';
    } else {
        return '<img src="' + img_src + '" onerror="$(this).hide();" width="' + size + '" title="' + rowObject.name + '" style="vertical-align:middle"/>';
    }
}

function EmptyComponentIcon_html(name, expected_image_src) {
    var name = name == undefined ? "...where is my name?" : name;
    var shown_name = name;
    if (name.length > 22) {
        shown_name = name.substring(0, 21) + '...';
    }
    return '<div style="font-size: 0.7em; word-wrap: break-word; width:50px; height:40px; display:inline-block; float: left; margin:1px"><div style=" padding:1px; width:43px; height:33px; border: 1px dotted;" title="' + name + '">' + shown_name + '</div></div>';
}

function GetResearchIcon_src(research_id, research_name) {
    var res_row = Researches.loaded_data_hash[research_id];
    var img_src = GetIcon_TryGetIcon(Researches.icon_folder, res_row);
    if (img_src) {
        return img_src;
    } else {
        if (res_row.statID) {
            /* Try get icon by statID field (this statID link some component directly linked to research)*/
            var found_obj = FindObjectById(res_row.statID);
            if (found_obj) {
                img_src = GetIcon_TryGetIcon(found_obj.dataObject.icon_folder, found_obj.row);
                if (img_src) {
                    return img_src;
                }
            }
        }
        if (res_row.resultComponents) {
            /* Try get icon by enum results of research */
            var comps_ids = res_row.resultComponents;
            for (var p in comps_ids) {
                var comp_id = comps_ids[p];
                var found_obj = FindObjectById(comp_id);
                if (found_obj) {
                    img_src = GetIcon_TryGetIcon(found_obj.dataObject.icon_folder, found_obj.row);
                    if (img_src) {
                        return img_src;
                    }
                }
            }
        }
    }
    return null;
}

function can_research(comp_id) {
    return ResearchedComponents[player_all_researched][comp_id] != undefined;
}


function Translate(str) {
    var lang_tag = site_language();
    var str_langs = MessagesTranslation[str];
    if (str_langs)
    {
        if (str_langs[lang_tag])
        {
            return str_langs[lang_tag];
        }
    }
    return str;
}

var disqus_config = function () {
    this.language = site_language();
};

function AddDiscuss(elem_selector, component_url)
{
    var disqus_url_str = component_url ? ' disqus_url = \'' + component_url + '\';' : '';
    var html = '\
    <div id="disqus_thread"></div>\
    <script type="text/javascript">\
        /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\
        var disqus_shortname = "warzone2100guide"; /* required: replace example with your forum shortname*/\
        ' + disqus_url_str + '\
    /* * * DON\'T EDIT BELOW THIS LINE * * */\
    (function () {\
        var dsq = document.createElement(\'script\'); dsq.type = \'text/javascript\'; dsq.async = true;\
        dsq.src = \'//\' + disqus_shortname + \'.disqus.com/embed.js\';\
        (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);\
    })();\
    </script>\
    <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>\
    ';
    elem_selector.html(html);
}


var MessagesTranslation = {

    /* designer_functions.js */
    "Sorry but you have not selected a row. Nothing will happen.": {
        ru: "Вы не выбрали строку в таблице. Ничего не произойдет.",
    },
    "Selected Multi-Turret Body but we do not support more than 2 turrets": {
        ru: "Выбранный корпус не может иметь более 2 орудий",
    },
    "Unit price": {
        ru: "Цена юнита",
    },
    "Price": {
        ru: "Цена",
    },
    "Total price of this tank (cyborg) design.": {
        ru: "Суммарная цена данного дизайна танка (киборга).",
    },
    "Time to build in Factory": {
        ru: "Время производства в фабрике",
    },
    "Time to build in Factory: no modules": {
        ru: "Время производства в фабрике с двумя модулями",
    },
    "Build time": {
        ru: "Время производства",
    },
    "Time needed to product this tank (cyborg) design in factory without additional factory modules.": {
        ru: "Время, необходимое чтобы произвести данный дизайн танка (киборга) в фабрике без дополнительных модулей.",
    },
    "Time to build in Factory: with 2 modules": {
        ru: "Время производства в фабрике с 2 модулями",
    },
    "Time needed to product this tank (cyborg) design in factory with 2 additional factory modules.": {
        ru: "Время, необходимое для производства данного дизайна танка (киборга) в фабрике с двумя дополнительбными модулями",
    },
    "Build points": {
        ru: "Очки производства",
    },
    "Build points are equal to production time.": {
        ru: "Очки производства определяют время, которое будет затрачено на производство данного дизайна.",
    },
    "Health Points": {
        ru: "Очки жизни",
    },
    "Armor": {
        ru: "Защита",
    },
    "How much damage this tank(cyborgs) can take before death.": {
        ru: "Сколько повреждения нужно нанести юниту чтобы он был уничтожен.",
    },
    "Kinetic armor": {
        ru: "Кинетическая броня",
    },
    "Armor reduces damage to minimum level 33% of damage. Kinetic armor affects damage with type KINETIC.": {
        ru: "Броня снижает получаемый урон, при этом минимальный урон это 33% от урона. Кинетическая броня защищает юнит от кинетического вида урона (KINETIC).",
    },
    "Thermal armor": {
        ru: "Огненная броня",
    },
    "Armor reduces damage to minimum level 33% of damage. Thermal armor affects damage with type HEAT.": {
        ru: "Броня снижает получаемый урон, при этом минимальный урон это 33% от урона. Огненная броня защищает юнит от огненного вида урона (THERMAL).",
    },
    "(Weapon 1)": {
        ru: "Орудие 1",
    },
    "(Weapon 2)": {
        ru: "Орудие 2",
    },
    "Damage": {
        ru: "Урон",
    },
    "no damage": {
        ru: "нет урона",
    },
    "Speed": {
        ru: "Скорость",
    },
    "Speed Road": {
        ru: "Скорость по дороге",
    },
    "How fast this tank can move on road (concrete) surface.": {
        ru: "Насколько быстро данный юнит будет двигаться по дороге или по бетонной поверхности",
    },
    "Speed Off-Road": {
        ru: "Скорость по бездорожью",
    },
    "Off-Road speed can be different. This parameter shows off-road speed for only one surface (SANDY_BUSH).": {
        ru: "Скорость по бездрожью может сильно различаться в зависимости от типа местности. Здесь приведена скорость по типу местности SANDY_BUSH.",
    },
    "Parameter": {
        ru: "Параметр",
    },
    "Base value": {
        ru: "Базовое значение",
    },
    "group": {
        ru: "группа",
    },
    "Upgraded value": {
        ru: "Значение параметра<br/>с учетом исследований",
    },
    "Upgrade Change": {
        ru: "% изменения параметра<br/>в результате исследований",
    },
    "Description": {
        ru: "Описание",
    },
    "Range": {
        ru: "Дальность",
    },
    "Damage dealt to enemy unit with each one shot.": {
        ru: "Урон наносимый цели за 1 выстрел.",
    },
    "Damage Type": {
        ru: "Тип урона",
    },
    "Type of damage. KINETIC damage affected by Kinetic armor. HEAT damage affected by Thermal armor.": {
        ru: "Тип урона может быть кинетическим или огненным. От кинетического урона защищает кинетическая броня. От огненного урона защищает огненная броня.",
    },
    "Splash Damage": {
        ru: "Урон по площади",
    },
    "Damage dealt to area. This damage does not affect main target of attack.": {
        ru: "Урон который, в дополнение к основному урону, наносится по площади в радиусе от основной цели. Данный урон не действует на основую цель атаки.",
    },
    "Splash Radius (tiles)": {
        ru: "Радиус урона по площади (в тайлах)",
    },
    "Radius of splash damage. Bigger readium means Splash damage will affect more enemy units.": {
        ru: "Радиус урона по площади. При большем радиусе урон 'заденет' большее число вражеских юнитов.",
    },
    "Shots per min (rate-of-fire)": {
        ru: "Выстрелов в минуту",
    },
    "Rate-of-fire.": {
        ru: "Число выстрелов в минуту",
    },
    "Salvo reload (sec)": {
        ru: "Время перезагрузки (сек)",
    },
    "Time to reload salvo weapon (seconds)": {
        ru: "Время перезагрузки определяет время между сериями выстрелов.",
    },
    "Period. damage": {
        ru: "Продолжит. урон в сек.",
    },
    "Additional damage per second. Note: periodical damage affects only enemy units which are stay in \'inflamed area\'": {
        ru: "Дополнительный продолжительный урон в секунду. Данный урон применяется при условии нахожденя цели в области поражения (на подожженной земле)",
    },
    "Period. time (seconds)": {
        ru: "Время продолж. урон",
    },
    "Duration of periodical damage.": {
        ru: "Время в течении котоого будет наноситься продолжительный урон. Время горения.",
    },
    "Period. radius (tiles)": {
        ru: "Радиус продолж. урона",
    },
    "Radius of periodical damage.": {
        ru: "Радиус круга, в котором должны находиться вражеские танки, чтобы получать продолжительный урон. Радиус подожженной земли. Радиус отсчитывается от центра, которым является местоложение основной цели атаки.",
    },
    "Range (tiles)": {
        ru: "Дальность (тайлов)",
    },
    "Maximum range of fire.": {
        ru: "Максимальная дальность стрельбы.",
    },
    "Ammo": {
        ru: "Количество зарядов",
    },
    "Ammo of VTOL-weapon.": {
        ru: "Количество зарядов. Боевая единица выстреливает все заряды, после чего возвращается на перезярядку.",
    },
    "Research Name": {
        ru: "Назв. исследования",
    },
    "cant research(!)": {
        ru: "нельзя исследовать",
    },
    "heat": {
        ru: "огненн.",
    },
    "kinetic": {
        ru: "кинетич.",
    },
    "Resistance": {
        ru: "Сопротивление",
    },
    "Propulsion type": {
        ru: "Тип ходовой",
    },
    "Weapon type": {
        ru: "Тип орудия",
    },
    "modifier": {
        ru: "модификатор",
    },
    "MEDIUM": {
        ru: "Средний (MEDIUM)",
    },
    "HARD": {
        ru: "Укрепленный (HARD)",
    },
    "BUNKER": {
        ru: "Бункер",
    },
    "Research": {
        ru: "Исследование",
    },
    "Research Time (min)": {
        ru: "Время исслед. (минимум)",
    },
    "Summ Upgrade value": {
        ru: "Сумма всех улучшений",
    },
    "Weapon class": {
        ru: "Тип орудия",
    },
    "Wheeled": {
        ru: "Колеса",
    },
    "Tracked": {
        ru: "Гусеницы",
    },
    "Legged": {
        ru: "Ноги (киборг)",
    },
    "Hover": {
        ru: "Возд. подуш. (Hover)",
    },
    "Lift": {
        ru: "СВВП (VTOL)",
    },
    "Propellor": {
        ru: "Пропеллер",
    },
    "Half-Tracked": {
        ru: "Полугусеницы",
    },
    "Structure type": {
        ru: "Тип постройки",
    },

    /* design.html */

    "Click to open Body Details": {
        ru: "Клик для просмотра деталей по корпусу",
    },
    "Click to open Propulsion Details": {
        ru: "Клик для просмотра деталей по ходовой",
    },
    "Click to open Turret Details": {
        ru: "Клик для просмотра деталей по башне",
    },
    "Tank Design": {
        ru: "Дизайн юнита",
    },

    /* Weapons.html */
    "Price added to total price of tank design.": {
        ru: "Стоимость, которая будет добавлена к суммарной стоимости юнита",
    },
    "Build Time (factory with 1 module)": {
        ru: "Время постройки (в фабрике с 1 модулем)",
    },
    "This time adds to total build time of tank design.": {
        ru: "Данное время будет добавлено к суммарному времени постройки юнита",
    },
    "Weight": {
        ru: "Вес",
    },
    "This weight adds to total weight of tank design.": {
        ru: "Данный вес будет прибавлен к суммарному весу юнита. Вес снижает скорость юнита.",
    },
    "Hit Points": {
        ru: "Очки жизни (HP)",
    },
    "Hit points are added to total hitpoint of tank design. Note: weapon hitpoints become increased with each composite alloys upgrade.": {
        ru: "Очки жизни будут добавлены к суммарным очкам жизни юнита. Очки жизни орудия увеличиваются при исследовании улучшений композитных сплавов.",
    },

    "sec": {
        ru: "сек",
    },
    "tiles": {
        ru: "тайлов",
    },
    "min": {
        ru: "мин",
    },
    "": {
        ru: "",
    },
    "": {
        ru: "",
    },
    "": {
        ru: "",
    },
    "": {
        ru: "",
    },
    "": {
        ru: "",
    },
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

