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

var designer_setted_timeout;

function InitDesigner() {
    
    $('#designer_all_data_container').hide();

    $("#designer_select_body_button").button({
        icons: {
            primary: "ui-icon-triangle-1-s",
        }
    }).click(function (event) {
        event.preventDefault();
        ShowSeletDialog_forDataObject(Bodies,$("#designer_body").attr('data-value'), function (selectedRowId) {
            if (selectedRowId == null) {
                alert(Translate('Sorry but you have not selected a row. Nothing will happen.'));
            } else {
                var body_id = localStorage["designer_designer_body"];
                var body = Bodies.loaded_data_hash[selectedRowId];
                if (body != undefined) {
                    if (body.weaponSlots >= 2) {
                        if (body.weaponSlots >= 3) {
                            alert(Translate('Selected Multi-Turret Body but we do not support more than 2 turrets'));
                        }
                        $('#designer_weapon2_row').show();
                    } else {
                        $('#designer_weapon2_row').hide();
                    }
                    setInput(Bodies, $("#designer_body"), selectedRowId, $("#designer_body_icon"));
                }

                
            }
            TryCalculateDesign();
        });
    });

    $("#designer_select_propulsion_button").button({
        icons: {
            primary: "ui-icon-triangle-1-s",
        }
    }).click(function (event) {
        event.preventDefault();
        ShowSeletDialog_forDataObject(Propulsion, $("#designer_propulsion").attr('data-value'), function (selectedRowId) {
            if (selectedRowId == null) {
                alert(Translate('Sorry but you have not selected a row. Nothing will happen.'));
            } else {
                setInput(Propulsion, $("#designer_propulsion"), selectedRowId, $("#designer_propulsion_icon"));
            }
            TryCalculateDesign();
        });
    });


    $("#designer_select_weapon_button").button({
        icons: {
            primary: "ui-icon-triangle-1-s",
        }
    }).click(function (event) {
        event.preventDefault();
        ShowSeletDialog_forDataObject(Weapons, $("#designer_weapon").attr('data-value'), function (selectedRowId) {
            if (selectedRowId == null) {
                alert(Translate('Sorry but you have not selected a row. Nothing will happen.'));
            } else {
                setInput(Weapons, $("#designer_weapon"), selectedRowId, $("#designer_weapon_icon"));
            }
            TryCalculateDesign();
        });
    });

    $("#designer_select_system_turret_button").button({
        icons: {
            primary: "ui-icon-triangle-1-s",
        }
    }).click(function (event) {
        event.preventDefault();

        var menu_dialog_id = "designer_select_system_turret_button_dialog";
        $('body').append('<div id="' + menu_dialog_id + '"></div>');
        var constr_button = $('<button id="designer_select_construction_button" type="button"><span lang="en">Construction (Trucks)</span><span lang="ru">Грузовики</span></button>');
        var sens_button = $('<button id="designer_select_sensor_button" type="button"><span lang="en">Sensor</span><span lang="ru">Сенсоры</span></button>');
        var repair_button = $('<button id="designer_select_repair_button" type="button"><span lang="en">Repair</span><span lang="ru">Ремонтники</span></button>');
        var ecm_button = $('<button id="designer_select_repair_button" type="button"><span lang="en">ECM (electoric stuff)</span><span lang="ru">ECM</span></button>');
        $('#' + menu_dialog_id).append(constr_button).append('<br/>');
        $('#' + menu_dialog_id).append(sens_button).append('<br/>');
        $('#' + menu_dialog_id).append(repair_button).append('<br/>');
        $('#' + menu_dialog_id).append(ecm_button).append('<br/>');

        var method_set_val = function (selectedRowId, DataObject) {
            if (selectedRowId == null) {
                alert(Translate('Sorry but you have not selected a row. Nothing will happen.'));
            } else {
                setInput(DataObject, $("#designer_weapon"), selectedRowId, $("#designer_weapon_icon"));
            }
            TryCalculateDesign();
            $('#' + menu_dialog_id).dialog("close")
        };

        constr_button.button({
            icons: {
                primary: "ui-icon-triangle-1-s",
            }
        }).click(function (event) {
            event.preventDefault();
            ShowSeletDialog_forDataObject(Construction, $("#designer_weapon").attr('data-value'), method_set_val);
        });

        sens_button.button({
            icons: {
                primary: "ui-icon-triangle-1-s",
            }
        }).click(function (event) {
            event.preventDefault();
            ShowSeletDialog_forDataObject(Sensor, $("#designer_weapon").attr('data-value'), method_set_val);
        });

        repair_button.button({
            icons: {
                primary: "ui-icon-triangle-1-s",
            }
        }).click(function (event) {
            event.preventDefault();
            ShowSeletDialog_forDataObject(Repair, $("#designer_weapon").attr('data-value'), method_set_val);
        });

        ecm_button.button({
            icons: {
                primary: "ui-icon-triangle-1-s",
            }
        }).click(function (event) {
            event.preventDefault();
            ShowSeletDialog_forDataObject(ECM, $("#designer_weapon").attr('data-value'), method_set_val);
        });
        $("#designer_select_system_turret_button").attr("disabled", true);
        $('#' + menu_dialog_id).dialog(
        {
            title: "Select an item",
            buttons:
            {
                "Cancel": function () {
                    $(this).dialog('close');
                }
            },
            width: 300, 
            close: function () {
                $("#designer_select_system_turret_button").attr("disabled", false);
                $(this).dialog("destroy");
                $("#" + menu_dialog_id).remove(); //guarantees dialog destruction
            }
            // position: { my: "center ce", at: "left bottom", of: window }
        });


    });
    

    $("#designer_select_weapon2_button").button({
        icons: {
            primary: "ui-icon-triangle-1-s",
        }
    }).click(function (event) {
        event.preventDefault();
        ShowSeletDialog_forDataObject(Weapons, $("#designer_weapon2").attr('data-value'), function (selectedRowId) {
            if (selectedRowId == null) {
                alert(Translate('Sorry but you have not selected a row. Nothing will happen.'));
            } else {
                setInput(Weapons, $("#designer_weapon2"), selectedRowId, $("#designer_weapon2_icon"));
            }
            TryCalculateDesign();
        });
    });

    $("#designer_select_weapon2_button_clear").button({
        icons: {
            primary: "ui-icon-close",
        }
    }).click(function (event) {
        event.preventDefault();
        setInput(Weapons, $("#designer_weapon2"), null, $("#designer_weapon2_icon"));
        TryCalculateDesign();
    });

    
    var func_val_slider = function (value) {
        return value.toHHMMSS();
    }

    jQuery('#designer_research_slider').slider({
        min: 0,
        max: 5400,
        step: 30,
        value: 600,
        range: "min",
        slide: function (event, ui) {
            jQuery('#designer_research_progress_input').val(func_val_slider(ui.value));
            localStorage["designer_research_slider"] = ui.value;
            if (last_calculated_research_time != undefined) {
                if (designer_setted_timeout != undefined) {
                    clearTimeout(designer_setted_timeout);
                    designer_setted_timeout = undefined;
                };
                ShowLoading('designer_all_data_container');
                designer_setted_timeout = setTimeout(function () {
                    TryCalculateDesign();
                    HideLoading('designer_all_data_container');
                }, 500);
            }
        }
    });
    $("#designer_research_progress_input").val(func_val_slider($("#designer_research_slider").slider("value")));

};

var last_calculated_research_time;

var player_all_researched = 8;
var player_current_design = 0;
function Designer_PreLoad(callback_function) {
    InitDesigner();
    LoadAllObjects(function () {
        DoResearchAll(player_all_researched, true, function () {

            var predefined_body_id = null;
            var predefined_propulsion_id = null;
            var predefined_turret1_id = null;
            var predefined_turret2_id = null;
            if (getUrlVars()["body_id"] == undefined) {
                if (localStorage["designer_designer_body"] != undefined) {
                    predefined_body_id = localStorage["designer_designer_body"];
                }
            } else {
                predefined_body_id = getUrlVars()["body_id"];
            }

            if (getUrlVars()["propulsion_id"] == undefined) {
                if (localStorage["designer_designer_propulsion"] != undefined) {
                    predefined_propulsion_id = localStorage["designer_designer_propulsion"];
                }
            } else {
                predefined_propulsion_id = getUrlVars()["propulsion_id"];
            }

            if (getUrlVars()["turret1_id"] == undefined) {
                if (localStorage["designer_designer_weapon"] != undefined) {
                    predefined_turret1_id = localStorage["designer_designer_weapon"];
                }
            } else {
                predefined_turret1_id = getUrlVars()["turret1_id"];
            }

            if (getUrlVars()["turret2_id"] == undefined) {
                if (localStorage["designer_designer_weapon2"] != undefined) {
                    predefined_turret2_id = localStorage["designer_designer_weapon2"];
                }
            } else {
                predefined_turret2_id = getUrlVars()["turret2_id"];
            }

            if (predefined_turret1_id != null) {
                setInput(FindComponentDataObject(predefined_turret1_id), $("#designer_weapon"), predefined_turret1_id, $("#designer_weapon_icon"));
            }
            if (predefined_turret2_id != null) {
                setInput(FindComponentDataObject(predefined_turret2_id), $("#designer_weapon2"), predefined_turret2_id, $("#designer_weapon2_icon"));
            }

            if (predefined_body_id != null) {
                var body = Bodies.loaded_data_hash[predefined_body_id];
                if (body != undefined) {
                    if (body.weaponSlots >= 2) {
                        if (body.weaponSlots >= 3) {
                            alert(Translate('Selected Multi-Turret Body but we do not support more than 2 turrets'));
                        }
                        $('#designer_weapon2_row').show();
                    } else {
                        $('#designer_weapon2_row').hide();
                    }
                    setInput(Bodies, $("#designer_body"), predefined_body_id, $("#designer_body_icon"));
                }
                
            }
            if (predefined_propulsion_id != null) {
                setInput(Propulsion, $("#designer_propulsion"), predefined_propulsion_id, $("#designer_propulsion_icon"));
            }

            if (localStorage["designer_research_slider"] != undefined) {
                var val = parseInt(localStorage["designer_research_slider"]);
                $("#designer_research_slider").slider('value', val);
                hs = $("#designer_research_slider").slider();
                hs.slider('option', 'slide')
                    .call(hs, null, { handle: $('.ui-slider-handle', hs), value: val });
            }

            TryCalculateDesign(callback_function);
        });

    });
}

function setInput(DataObject, input_selector, selectedRowId, input_selector_icon) {
    
    input_selector.attr('data-value', selectedRowId);
    if (selectedRowId == null) {
        input_selector.val(null);
        input_selector_icon.html('');
    } else {
        var tmp_name = DataObject.loaded_data_hash[selectedRowId].name;
        input_selector.val(tmp_name);
        if (DataObject.GetIconHtml_Function == undefined) {
            input_selector_icon.html(EmptyComponentIcon_html(tmp_name));
        }
        else {
            input_selector_icon.html(DataObject.GetIconHtml_Function(DataObject.loaded_data_hash[selectedRowId]));
        }
    }
    if (selectedRowId == null) {
        localStorage.removeItem("designer_" + input_selector.attr('id'));
        input_selector.removeAttr('data-value');
    } else {
        localStorage["designer_" + input_selector.attr('id')] = selectedRowId;
    }



}


var designer_dialogs = {};

function ShowSeletDialog_forDataObject(DataObject, selected_value, callback_function) {

    //var ok_func = function () {
    //    var selectedRowId = grid.jqGrid('getGridParam', 'selrow');
    //    if (callback_function != undefined) {
    //        callback_function(selectedRowId);
    //    }
    //    $(this).dialog('close');
    //};

    if (designer_dialogs[DataObject.sysid] != undefined) { //try to use saved dialog
        var dialog = $(designer_dialogs[DataObject.sysid].dialog);
        var grid = $(designer_dialogs[DataObject.sysid].grid)

        dialog.dialog('option', 'buttons', {
            "Ok": function () {
                var selectedRowId = grid.jqGrid('getGridParam', 'selrow');
                if (callback_function != undefined) {
                    callback_function(selectedRowId, DataObject);
                }
                $(this).dialog('close');
            },
            "Cancel": function () {
                $(this).dialog('close');
            }
        });
        dialog.dialog('open');

        if (selected_value != null && selected_value != undefined) {
            grid.jqGrid('setSelection', selected_value);
        }

        return;
    }

    //var container_id = "dialog_grid";
    var container_id = 'designer_dialog_' + DataObject.sysid;

    $('body').append($('<div/>', {
        id: container_id
    }));


    LoadDataObject(DataObject, function () {
        
        var grid = DrawGrid(DataObject, container_id, null, 575, 575);
        designer_dialogs[DataObject.sysid] = {};
        designer_dialogs[DataObject.sysid].grid = grid; //save dialog and grid
        designer_dialogs[DataObject.sysid].dialog = $("#" + container_id).dialog(
        {
            title: "<span lang='en'>Select an item</span><span lang='ru'>Выберите элемент</span>",
            buttons:
            {
                "Ok": function () {
                    var selectedRowId = grid.jqGrid('getGridParam', 'selrow');
                    if (callback_function != undefined) {
                        callback_function(selectedRowId, DataObject);
                    }
                    $(this).dialog('close');
                },
                "Cancel": function () {
                    $(this).dialog('close');
                }
            },
            modal: true,
            width: 600,
            height: 700,
            close: function () {
                //$(this).dialog("destroy");
                //$("#" + dialog_id).remove(); //guarantees dialog destruction
                //this.hide();
            },
            // position: { my: "center ce", at: "left bottom", of: window }
        });
        if (selected_value != null && selected_value != undefined) {
            grid.jqGrid('setSelection', selected_value);
        }
    });
}



function Weapon_ShotsPerMinute(weapon) {
    if (weapon.firePause == undefined && weapon.reloadTime == undefined)
        return 0;
    var firepause = weapon.firePause == undefined ? 1 : weapon.firePause; //fire pause can be skipped in weapons.ini for some weapons (VTOL Scourge Missile)
    var reloadTime = weapon.reloadTime == undefined ? 0 : weapon.reloadTime;
    var num_rounds = weapon.numRounds == undefined ? 1 : weapon.numRounds;
    if (num_rounds == 0) num_rounds = 1;
    return 600 / (firepause * num_rounds + reloadTime) * num_rounds;
}

var WeaponAbilities = function () { };
WeaponAbilities.prototype = (function () {
    var me = {};
    me.HasSplash = false;
    me.HasPeriodicalDamage = false;
    me.HeatDamage = false;
    me.Indirect = false;
    me.CanHitVtols = false;
    me.CannotHitGround = false;
    me.VTOLWeapon = false;
    me.CyborgWeapon = false;
    me.ShortRanged = false;
    me.LongRanged = false;
    me.Penetrate = false;
    me.CantFireOnMove = false;
    //me.UpgradeLine = "";
    me.HitRun = false;
    return me;
})();


var BodyAbilities = function () { };
BodyAbilities.prototype = (function () {
    var me = {};
    me.SlowDesign = false; 
    me.CrossWater = false;
    me.FlyingUnit = false;
    me.Cyborg = false;
    return me;
})();

var List_of_HitRun_Weapons = 
{
    CyborgRocket: 0, //LancerCyborg
    'Cyb-Hvywpn-TK': 0,
    'Cyb-Wpn-Atmiss': 0,
    'Cyb-Hvywpn-A-T': 0
}

function Weapon_GetAbilities(weapon) {
    var res = new WeaponAbilities();
    res.CanHitVtols = weapon.flags == undefined ? false : weapon.flags.indexOf("ShootAir") >= 0 || weapon.flags.indexOf("AirOnly") >= 0;
    res.CannotHitGround = weapon.flags == undefined ? false : weapon.flags.indexOf("AirOnly") >= 0;
    res.CantFireOnMove = weapon.fireOnMove == undefined ? false : weapon.fireOnMove == 0 || weapon.fireOnMove == "0";
    res.CyborgWeapon = weapon.grid_id.toLowerCase().indexOf("cyborg") >= 0 || weapon.name.toLowerCase().indexOf("cyborg") >= 0 || weapon.grid_id.toLowerCase().indexOf("cyb-") >= 0 || weapon.name.toLowerCase().indexOf("cyb-") >= 0;
    res.HasPeriodicalDamage = weapon.periodicalDamage == undefined ? false : weapon.periodicalDamage > 0;
    res.HasSplash = weapon.radiusDamage == undefined ? false : weapon.radiusDamage > 0;
    res.HeatDamage = weapon.weaponClass == undefined ? false : weapon.weaponClass == "HEAT";
    res.Indirect = weapon.movement == undefined ? false : (weapon.movement == "INDIRECT" || weapon.movement == "HOMING-INDIRECT");
    res.LongRanged = weapon.longRange / 128 > 13;
    res.Penetrate = weapon.penetrate == undefined ? false : parseInt(weapon.penetrate) == 1;
    res.ShortRanged = weapon.longRange / 128 < 6;
    //res.UpgradeLine = weapon.weaponSubClass;
    res.VTOLWeapon = weapon.numAttackRuns == undefined ? false : parseInt(weapon.numAttackRuns) > 0;
    res.HitRun = List_of_HitRun_Weapons[weapon.grid_id] != undefined
                || ((weapon.numRounds == undefined ? false : parseInt(weapon.numRounds) > 1)
                && (weapon.firePause == undefined ? false : parseInt(weapon.firePause) < 20)
                && (weapon.reloadTime == undefined ? false : parseInt(weapon.reloadTime) > 50) //reload time > 5 sec.
                );
    return res;
}

function Body_GetAbilities(Tank) {
    var res = new BodyAbilities();
    res.SlowDesign = Tank.speed_road < Tank.propulsion.speed/128 * 0.7 || Tank.speed_bonus < 1.3;
    res.CrossWater = Tank.propulsion.type == 'Hover' || Tank.propulsion.type == 'Propellor';
    res.FlyingUnit = Tank.propulsion.type == 'Lift';
    res.Cyborg = Tank.propulsion.type == 'Legged' || (Tank.body.class == undefined ? false : Tank.body.class == 'Cyborgs');
    return res;
}


function Abilities_Description(ability_name) {
    var res = {};
    res.name = "";
    res.descr = "";
    res.icon_class = "";
    res.designer_only_ability = false;
    switch (ability_name) {
        case "CanHitVtols":
            res.name = "<span lang='en'>Can Attack VTOLs</span><span lang='ru'>Может атаковать СВВП (VTOL)</span>";
            res.descr = "<span lang='en'>This unit can attack and kill flying enemy units. Warzone units can't attack VTOLs by default.</span><span lang='ru'>Этот юнит может атаковать и уничтожать вражеские воздушные цели.</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;
        case "CannotHitGround":
            res.name = "<span lang='en'>Can't attack ground units</span><span lang='ru'>Не может атаковать наземные цели</span>";
            res.descr = "<span lang='en'>This is Anti-Air unit. This unit can attack <b>only</b> flying units.</span><span lang='ru'>Атака только по принципу \"Воздух-Воздух\". Может атаковать только летающие цели.</span>";
            res.icon_class = "ui-icon ui-icon-alert";
            break;
        case "CantFireOnMove":
            res.name = "<span lang='en'>Can't fire on move</span><span lang='ru'>Не может атаковать в движении</span>";
            res.descr = "<span lang='en'>This unit need stop moving before attack.</span><span lang='ru'>Этот юнит может вести огонь только когда стоит на месте.</span>";
            res.icon_class = "ui-icon ui-icon-shuffle";
            break;
        case "CyborgWeapon":
            res.name = "<span lang='en'>Cyborg Weapon</span><span lang='ru'>Орудие киборгов</span>";
            res.descr = "<span lang='en'>This weapon can be used only by cyborgs.</span><span lang='ru'>Данное орудие могут использовать только киборги и в игре оно не доступно для установки на танки.</span>";
            res.icon_class = "ui-icon ui-icon-alert";
            res.designer_only_ability = true;
            break;
        case "HasPeriodicalDamage":
            res.name = "<span lang='en'>Over time damage</span><span lang='ru'>Продолжительное повреждение</span>";
            res.descr = "<span lang='en'>This unit has additional continious damage</span><span lang='ru'>Этот юнит при атаке может \"поджигать\" вражеские танки, и они будут получать повреждения в течение некоторого времени.</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;
        case "HasSplash":
            res.name = "<span lang='en'>Area damage</span><span lang='ru'>Урон по площади</span>";
            res.descr = "<span lang='en'>This unit has additional area damage. Area damage inflicts all units nearby main target of attack</span><span lang='ru'>Этот юнит при атаке наносит урон нескольким вражеским единицам одновременно. Все вражеские единицы в некотором радиусе от цели получат повреждение.</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;
        case "HeatDamage":
            res.name = "<span lang='en'>Thermal (heat) kind of attack</span><span lang='ru'>Огненный тип урона</span>";
            res.descr = "<span lang='en'>This unit attacks by thermal (heat) damage, so enemy tank should have good thermal armor</span><span lang='ru'>Этот юнит атакует огнем. Вражеский юнит должен иметь высокую (анти)огненную броню, чтобы противостоять данному юниту.</span>";
            res.icon_class = "ui-icon ui-icon-shuffle";
            break;
        case "Indirect":
            res.name = "<span lang='en'>Indirect (artillery)</span><span lang='ru'>Артиллерия (стрельба навесом)</span>";
            res.descr = "<span lang='en'>This unit can be attached to sensor and can attack through terrain and enemy tanks.</span><span lang='ru'>Этот юнит является артиллерией и может поражать цели которые не находятся в прямой видимости. Данный юнит может быть прикреплен к сенсору.</span>";
            res.icon_class = "ui-icon ui-icon-shuffle";
            break;
        case "LongRanged":
            res.name = "<span lang='en'>Long ranged</span><span lang='ru'>Дальнобойный</span>";
            res.descr = "<span lang='en'>This unit has high range of fire.</span><span lang='ru'>Этот юнит имеет высокую дальность огня.</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;
        case "Penetrate":
            res.name = "<span lang='en'>Penetrate</span><span lang='ru'>Проникающие снаряды</span>";
            res.descr = "<span lang='en'>Each projectile of this unit can hit several enemy unis on one line</span><span lang='ru'>Каждый снаряд может нанести повреждение нескольким целям на одной линии.</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;
        case "ShortRanged":
            res.name = "<span lang='en'>Short ranged</span><span lang='ru'>Орудие ближнего боя</span>";
            res.descr = "<span lang='en'>Attacks from very short distance</span><span lang='ru'>Данное орудие имеет очень короткую дистацию ведения огня. Цель должна быть близко чтобы её можно было атаковать.</span>";
            res.icon_class = "ui-icon ui-icon-alert";
            break;
        case "UpgradeLine":
            res.name = "<span lang='en'>Weapon Line</span><span lang='ru'>Исслед. линия орудий</span>";
            res.descr = "";
            res.designer_only_ability = true;
            break;
        case "VTOLWeapon":
            res.name = "<span lang='en'>VTOL weapon</span><span lang='ru'>СВВП-орудие (VTOL)</span>";
            res.descr = "<span lang='en'>This weapon can be used only on VTOL-units.</span><span lang='ru'>Данное орудие может использоваться только на юнитах СВВП (VTOL).</span>";
            res.icon_class = "ui-icon ui-icon-alert";
            res.designer_only_ability = true;
            break;
        case "HitRun":
            res.name = "<span lang='en'>Hit&Run</span><span lang='ru'>Hit&Run - стреляй и беги</span>";
            res.descr = "<span lang='en'>This weapon has high damage and a slow reload, making it excellent in hit&run tactics.</span><span lang='ru'>Орудие имеет большой урон и очень медленно перезаряжается, поэтому его выгодно использовать в тактике Hit&Run (тактика залпа и немедленного отступления для перезарядки).</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;

            
        case "SlowDesign":
            res.name = "<span lang='en'>Slow</span><span lang='ru'>Медленный</span>";
            res.descr = "<span lang='en'>Speed of this unit is very slow (comparing to maximum speed for propulsion)</span><span lang='ru'>Этот юнит имеет очень низкую скорость.</span>";
            res.icon_class = "ui-icon ui-icon-alert";
            break;
        case "CrossWater":
            res.name = "<span lang='en'>Can cross water</span><span lang='ru'>Может двигаться по воде</span>";
            res.descr = "<span lang='en'>This unit can cross water tiles.</span><span lang='ru'>Юнит может двигаться по воде.</span>";
            res.icon_class = "ui-icon ui-icon-star";
            break;
        case "FlyingUnit":
            res.name = "<span lang='en'>Flying units (VTOL)</span><span lang='ru'>Летающий</span>";
            res.descr = "<span lang='en'>This is VTOl-unit.</span><span lang='ru'>Юнит может летать.</span>";
            res.icon_class = "ui-icon ui-icon-shuffle";
            break;
        case "Cyborg":
            res.name = "<span lang='en'>Cyborg</span><span lang='ru'>Киборг</span>";
            res.descr = "<span lang='en'>This is robotic warrior (selected cyborg body and/or cyborg propulsion)</span><span lang='ru'>Это киборг (выбран корпус киборгов и/или ходовая киборгов).</span>";
            res.icon_class = "ui-icon ui-icon-shuffle";
            res.designer_only_ability = true;
            break;
        default:
            break;
    }
    return res;
}

function Form_Weapon_Abilities_html(weapon, is_structure_weapon, setted_abilities) {
    var abils_html = "";
    var abils = Weapon_GetAbilities(weapon);
    if (is_structure_weapon == true) {
        abils.HitRun = false;
    }
    for (var ability in abils) {
        if (typeof abils[ability] == "boolean") {
            if (abils[ability]) {
                if (setted_abilities != undefined) {
                    if (setted_abilities[ability])
                    {
                        continue;
                    }
                    setted_abilities[ability] = true;
                }
                var des = Abilities_Description(ability);
                abils_html += '<div class="ui-widget-content ui-corner-all" style="padding:5px">';
                if (des.icon_class != undefined && des.icon_class != "") {
                    abils_html += '<span style="display:inline-block; margin-right:2px" class="' + des.icon_class + '"></span>';
                }
                abils_html += '<div style="display:inline-block;"><b>' + des.name + '</b></div>';
                abils_html += '<div style="font-size:0.8em;">' + des.descr + '</div>';
                abils_html += '</div>'

            }
        } else {
            abils_html += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">' + ability + ': <b>' + abils[ability] + '</b></div>';
        }
    }
    return abils_html;
}

function FormAbilitiesHtml(TankDesign) {

    var abils_html = "";
    var setted_abilities = {}; //storage for abilities. Has exffect in case od multi-turret designs
    for (var i = 0; i < TankDesign.turrets.length; i++) {
        var turret_id = TankDesign.turrets[i].grid_id;
        if (Weapons.loaded_data_hash[turret_id] == undefined) {
            var form_abil_html = function (name, descr) {
                abils_html += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">';
                abils_html += '<span style="display:inline-block;" class="ui-icon ui-icon-star"></span>';
                abils_html += '<div style="display:inline-block;"><b>' + name + '</b></div>';
                abils_html += '<div style="font-size:0.8em;">' + descr + '</div>';
                abils_html += '</div>'
            }
            if (Sensor.loaded_data_hash[turret_id] != undefined && setted_abilities["sensor"]==undefined) {
                form_abil_html("<span lang='en'>This is Sensor Unit</span><span lang='ru'>Это сенсор</span>", "<span lang='en'>Artillery can be attached to this unit.</span><span lang='ru'>Этот юнит может наводит огонь артиллерии.</span>");
                setted_abilities["sensor"] = true;
            } else if (Repair.loaded_data_hash[turret_id] != undefined && setted_abilities["repair"] == undefined) {
                form_abil_html("<span lang='en'>This is Repair unit</span><span lang='ru'>Это ремонтник</span>", "<span lang='en'>This unit can 'cure' damaged tanks</span><span lang='ru'>Этот юнит может 'лечить' поврежденные юниты</span>");
                setted_abilities["repair"] = true;
            } else if (Construction.loaded_data_hash[turret_id] != undefined && setted_abilities["truck"] == undefined) {
                form_abil_html("<span lang='en'>This is Construction unit</span><span lang='ru'>Это грузовик</span>", "<span lang='en'>This unit can build base and defensive buildings</span><span lang='ru'>Этот юнит может строить.</span>");
                setted_abilities["truck"] = true;
            } else if (ECM.loaded_data_hash[turret_id] != undefined && setted_abilities["ecm"] == undefined) {
                form_abil_html("<span lang='en'>This is weird electonic unit</span><span lang='ru'>Это юнит электронной войны</span>", "<span lang='en'>I dont know what this unit can do :)</span><span lang='ru'>Я не знаю что может делать этот юнит :)</span>");
                setted_abilities["ecm"] = true;
            }
        }else{
            abils_html += Form_Weapon_Abilities_html(TankDesign.turrets[i], false, setted_abilities);
        }
    }
    var abils = Body_GetAbilities(TankDesign);
    for (var ability in abils) {
        if (typeof abils[ability] == "boolean") {
            if (abils[ability]) {
                var des = Abilities_Description(ability);
                abils_html += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">';
                if (des.icon_class != undefined && des.icon_class != "") {
                    abils_html += '<span style="display:inline-block;" class="' + des.icon_class + '"></span>';
                }
                abils_html += '<div style="display:inline-block;"><b>' + des.name + '</b></div>';
                abils_html += '<div style="font-size:0.8em;">' + des.descr + '</div>';
                abils_html += '</div>'
            }
        } else {
            abils_html += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">' + ability + ': <b>' + abils[ability] + '</b></div>';
        }
    }
    return abils_html;
}

function Form_ResearchRequirements_Html(turrets_ids, body_id, propulsion_id) {

    var res = "";
    var resComp = ResearchedComponents[player_all_researched];
    var can_research = resComp[body_id] != undefined && resComp[propulsion_id] != undefined;
    for (var i = 0; i < turrets_ids.length; i++) {
        can_research = can_research && resComp[turrets_ids[i]];
    }
    if(can_research)
    {
        var minTime = Math.max(resComp[body_id].time_seconds, resComp[propulsion_id].time_seconds);
        for (var i = 0; i < turrets_ids.length; i++) {
            minTime = Math.max(minTime, resComp[turrets_ids[i]].time_seconds);
        }
        if (ResearchTimeState[player_current_design] < minTime) {
            res += '<div style="display:inline-block;padding:5px;"><span style="display:inline-block;float:left;" \
                    class="ui-icon ui-icon-alert"></span><b><span lang="en">This design is not available on current selected research time</span><span lang="ru">Данный дизайн не доступен на выбранное время исследований</span></b></div>';
        }
    }else{
        res += '<span style="display:inline-block;" class="ui-icon ui-icon-alert"></span>' +
            '<div style="display:inline-block;padding:5px;"><b><span lang="en">This might not be researchable for design.</span><span lang="ru">Это может быть невозможно исследовать.</span></b></div>';
    }

    for (var i = 0; i < turrets_ids.length; i++) {
        var resComp_i = resComp[turrets_ids[i]];
        var res_path_href = "Research.html?tree=1&component_id=" + turrets_ids[i];
        var res_href = resComp_i == undefined ? '' : "Research.html?details_id=" + resComp_i.research_id;
        var turret = FindTurretById(turrets_ids[i]);
        var res_time = resComp_i == undefined ? "<span lang='en'>unknown</span><span lang='ru'>не известно</span>" : resComp_i.time_seconds.toHHMMSS();
        var comp_name = turret == null ? "<span lang='en'>unknown</span><span lang='ru'>не известно</span>" : turret.name;
        res += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">';
        res += '<div>Turret <span class="span_button" onclick="window.open(\'' + res_href + '\')">"' + comp_name + '"</span> : <a href="' + res_path_href + '" style="float:right;margin-left:5px;"><span lang="en">see path</span><span lang="ru">иссл. путь</span></a><span style="float:right;"><b>' + res_time + '</b></span></div>';
        res += '</div>'
    }

    {
        var resComp_i = resComp[body_id];
        var res_path_href = "Research.html?tree=1&component_id=" + body_id;
        var res_href = resComp_i == undefined ? '' : "Research.html?details_id=" + resComp_i.research_id;
        var bod_time = resComp_i == undefined ? "<span lang='en'>unknown</span><span lang='ru'>не известно</span>" : resComp_i.time_seconds.toHHMMSS();
        var bod_name = Bodies.loaded_data_hash[body_id] == undefined ? "<span lang='en'>unknown</span><span lang='ru'>не известно</span>" : Bodies.loaded_data_hash[body_id].name;
        res += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">';
        res += '<div>Body <span class="span_button" onclick="window.open(\'' + res_href + '\')">"' + bod_name + '"</span> : <a href="' + res_path_href + '" style="float:right;margin-left:5px;"><span lang="en">see path</span><span lang="ru">иссл. путь</span></a><span style="float:right;"><b>' + bod_time + '</b></span></div>';
        res += '</div>';
    }

    {
        var resComp_i = resComp[body_id];
        var res_path_href = "Research.html?tree=1&component_id=" + propulsion_id;
        var res_href = resComp_i == undefined ? '' : "Research.html?details_id=" + resComp_i.research_id;
        var prop_time = resComp_i == undefined ? "<span lang='en'>unknown</span><span lang='ru'>не известно</span>" : resComp_i.time_seconds.toHHMMSS();
        var prop_name = Propulsion.loaded_data_hash[propulsion_id] == undefined ? "<span lang='en'>unknown</span><span lang='ru'>не известно</span>" : Propulsion.loaded_data_hash[propulsion_id].name;
        res += '<div class="ui-widget-content ui-corner-all" style="padding:5px;">';
        res += '<div>Propulsion <span class="span_button" onclick="window.open(\'' + res_href + '\')">"' + prop_name + '"</span> : <a href="' + res_path_href + '" style="float:right;margin-left:5px;"><span lang="en">see path</span><span lang="ru">иссл. путь</span></a><span style="float:right;"><span style="float:right; display:inline"><b>' + prop_time + '</b></span></div>';
        res += '</div>';
    }
    return res;

}


function Designer_Draw_DPSTable(container_id, TankWeapons, enemy_player_number) {
    
    //$('#designer_dps_header').html('DPS (Damage per second) : Research Time=' + last_calculated_research_time.toHHMMSS());

    var designs = [];

    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body1REC", "wheeled01")); //viper wheels
    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body1REC", "HalfTrack")); //viper half-tracks

    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body5REC", "wheeled01")); //cobra half-tracks
    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body5REC", "hover01")); //cobra hover
    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body8MBT", "tracked01")); //scorpion tracks

    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body11ABT", "HalfTrack")); //python half-tracks
    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body11ABT", "hover01")); //python hover
    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body12SUP", "tracked01")); //mantis tracks
    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body9REC", "hover01")); //tiger hover

    designs.push(CalculateDesign_fromIDs(enemy_player_number, "Cannon1Mk1", "Body5REC", "V-Tol")); //VTOL cobra

    var grid_data = [];
    for (var i = 0; i < designs.length; i++) {
        var dps_360s = calculate_damage(TankWeapons, designs[i], 360);
        grid_data[i] = {};
        grid_data[i].id = i;
        grid_data[i].group = designs[i].body.size;
        grid_data[i].weapon = designs[i].turrets[0].name;
        grid_data[i].body = designs[i].body.name;
        grid_data[i].propulsion = designs[i].propulsion.name;
        grid_data[i].dps = (dps_360s / 360).toFixed(1);
    }

    var grid_element_id = ResetGridContainer(container_id, false);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: 'auto',
        colModel:
            [
                { label: "", name: "id", width: '1px', key:true, hidden:true },
                { label: "<span lang='en'>Class</span><span lang='ru'>Класс</span>", name: "group", width: '100px' },
                { label: "<span lang='en'>Body</span><span lang='ru'>Корпус</span>", name: "body", width: '100px' },
                { label: "<span lang='en'>Propulsion</span><span lang='ru'>Ходовая</span>", name: "propulsion", width: '100px' },
                { label: "<span lang='en'>Weapon</span><span lang='ru'>Орудие</span>", name: "weapon", width: '100px' },
                { label: "<span lang='en'>DPS (damage per second)</span><span lang='ru'>ДПС (урон в секунду)</span>", name: "dps", width: '100px' },
            ],
        onSelectRow: function (rowid) {
        },
        loadonce: true,
        ignoreCase: true, //make search case insensitive
        grouping: true,
        groupingView: {
            groupField: ['group'],
            groupText: ['<b> {0} </b>'],
            groupColumnShow: [false]
        },
    });

}

function calculate_damage(TankWeapons, TankTo, time_seconds) {
    
    var damage = [];
    for (var i = 0; i < TankWeapons.length; i++) {
        if (Weapons.loaded_data_hash[TankWeapons[i].grid_id] == undefined) {
            continue; //this is non-weapon turret
        }
        var tank1weap = TankWeapons[i];
        var tank1_abils = Weapon_GetAbilities(tank1weap);
        var tank2_abils = Body_GetAbilities(TankTo);
        if (tank2_abils.FlyingUnit) {
            if (!tank1_abils.CanHitVtols) {
                continue;
            }
        }
        if (tank1_abils.CannotHitGround && tank1_abils.CanHitVtols) {
            if (!tank2_abils.FlyingUnit) {
                continue;
            }
        }

        var armor_direct;
        var armor_periodical = TankTo.armourHeat;
        if (tank1_abils.HeatDamage) {
            armor_direct = TankTo.armourHeat;
        } else {
            armor_direct = TankTo.armourKinetic;
        }

        var propulsion_modifier = parseInt(PropulsionModifiers.loaded_data_hash[tank1weap.weaponEffect][TankTo.propulsion.type]);

        var shots_count = Weapon_ShotsPerMinute(tank1weap) * (time_seconds / 60);
        var clean_damage = tank1weap.damage * propulsion_modifier / 100;
        var per_second_damage = 0;
        if (tank1_abils.HasPeriodicalDamage) {
            var clean_damage_incendiary_per_second = tank1weap.periodicalDamage; //version 3.1.0 100% incen damage + //будем считать что шанс поджесь 100%, потом надо будет переделать на мин. и макс. урон
            per_second_damage = clean_damage_incendiary_per_second - armor_periodical;
        } else {
            per_second_damage = 0;
        }

        var one_shot_damage = Math.max(clean_damage / 3, clean_damage - armor_direct);
        damage.push(one_shot_damage * shots_count + per_second_damage * time_seconds);
    }
    var total_damage = 0;
    for (var i = 0; i < damage.length; i++) {
        total_damage += damage[i];
    }
    return total_damage;
}

function CalculateDesign_fromIDs(player, weapon_id, body_id, propulsion_id, non_weapon_design) {
    var turret = GetTurretDataRow(weapon_id, non_weapon_design);
    var body = Bodies.loaded_data_hash[body_id];
    var propulsion = Propulsion.loaded_data_hash[propulsion_id];
    return CalculateTankDesign(player, [turret], body, propulsion, non_weapon_design);
}

var designer_player = 0;
function TryCalculateDesign(callback_function) {

    ShowLoading('tabs_left');

    LoadAllObjects(function () {

        var player = designer_player;
        HideLoading('tabs_left');
        
        var turret1_id = $("#designer_weapon").attr('data-value');
        var turret1 = turret1_id != null && turret1_id != undefined ? FindComponentDataObject(turret1_id).loaded_data_hash[turret1_id] : undefined;

        var turret2_id = $("#designer_weapon2").attr('data-value');
        var turret2 = turret2_id != null && turret2_id != undefined ? FindComponentDataObject(turret2_id).loaded_data_hash[turret2_id] : undefined;
        //if (weapon == undefined) return;
       
        var body_id = $("#designer_body").attr('data-value');
        var body = Bodies.loaded_data_hash[body_id];
        //if (body == undefined) return;
        
        var num_turrets = body == undefined ? 1 : (body.weaponSlots > 1 && turret2 != undefined ? 2 : 1);
        var turrets = num_turrets > 1 ? [turret1, turret2] : [turret1];
        var turrets_ids = num_turrets > 1 ? [turret1_id, turret2_id] : [turret1_id];

        var propulsion_id = $("#designer_propulsion").attr('data-value');
        var propulsion = Propulsion.loaded_data_hash[propulsion_id];
        //if (propulsion == undefined) return;


        if (body == undefined ? true : (body.weaponSlots > 1 ? false : true)) {
            $('#designer_weapon2_row').hide();
        }

        is_unfinished_design = turret1 == undefined || body == undefined || propulsion == undefined;


        var show_params_method = function () {
            //this method should be called when research processes 
            //var weapon_upgraded = Upgrades[player].Weapon[weapon.index_of_datarow];
            //var body_upgraded = Upgrades[player].Body[body.index_of_datarow];

            var Tank = CalculateTankDesign(player, turrets, body, propulsion);

            var grid_data = [];
            var group_prefix = 0;
            /* PRICE & BUILD POINTS */
            {
                var row = new Object;
                row.name = Translate('Unit price');
                row.base = Tank.baseStats.price.toFixed(0);
                row.upgraded = Tank.price.toFixed(0);
                row.group = ++group_prefix + ': ' + Translate('Price');
                row.descr = Translate('Total price of this tank (cyborg) design');
                grid_data.push(row);
            }

            {
                var row = new Object;
                if (propulsion.type == 'Legged') {
                    row.name = Translate('Time to build in Factory');
                } else {
                    row.name = Translate('Time to build in Factory: no modules');
                }
                row.base = Tank.baseStats.buildTimeSeconds_factory_nomodules.toMMSS();
                row.upgraded = Tank.buildTimeSeconds_factory_nomodules.toMMSS();
                row.upgrade_change = (Tank.buildTimeSeconds_factory_nomodules - Tank.baseStats.buildTimeSeconds_factory_nomodules) / Tank.baseStats.buildTimeSeconds_factory_nomodules;
                row.group = ++group_prefix + ': ' + Translate('Build time');
                row.descr = Translate('Time needed to product this tank (cyborg) design in factory without additional factory modules.');
                grid_data.push(row);
            }

            if (propulsion.type != 'Legged')
            {
                var row = new Object;
                row.name = Translate('Time to build in Factory: with 2 modules');
                row.base = Tank.baseStats.buildTimeSeconds_factory_with2modules.toMMSS();
                row.upgraded = Tank.buildTimeSeconds_factory_with2modules.toMMSS();
                row.upgrade_change = (Tank.buildTimeSeconds_factory_with2modules - Tank.baseStats.buildTimeSeconds_factory_with2modules) / Tank.baseStats.buildTimeSeconds_factory_with2modules;
                row.group = group_prefix + ': ' + Translate('Build time');
                row.descr = Translate('Time needed to product this tank (cyborg) design in factory with 2 additional factory modules.');
                grid_data.push(row);
            }

            {
                var row = new Object;
                row.name = Translate('Build points');
                row.base = Tank.baseStats.buildPoints;
                row.upgraded = Tank.buildPoints;
                row.upgrade_change = (row.upgraded - row.base) / row.base;
                row.group = group_prefix + ': ' + Translate('Build time');
                row.descr = Translate('Build points are equal to production time.');
                grid_data.push(row);
            }

            /* Armor */
            {
                var row = new Object;
                row.name = Translate('Health Points');
                row.base = Tank.baseStats.hitpoints;
                row.upgraded = Tank.hitpoints.toInt();
                row.upgrade_change = (row.upgraded - row.base) / row.base;
                row.group = ++group_prefix + ': ' + Translate('Armor');
                row.descr = Translate('How much damage this tank(cyborgs) can take before death.');
                grid_data.push(row);
            }
            {
                var row = new Object;
                row.name = Translate('Kinetic armor');
                row.base = Tank.baseStats.armourKinetic;
                row.upgraded = Tank.armourKinetic.toInt();
                row.upgrade_change = ((row.upgraded - row.base) / row.base).toInt();
                row.group = group_prefix + ': ' + Translate('Armor');
                row.descr = Translate('Armor reduces damage to minimum level 33% of damage. Kinetic armor affects damage with type KINETIC.');
                grid_data.push(row);
            }
            {
                var row = new Object;
                row.name = Translate('Thermal armor');
                row.base = Tank.baseStats.armourHeat;
                row.upgraded = Tank.armourHeat.toInt();
                row.upgrade_change = ((row.upgraded - row.base) / row.base).toInt();
                row.group = group_prefix + ': ' + Translate('Armor');
                row.descr = Translate('Armor reduces damage to minimum level 33% of damage. Thermal armor affects damage with type HEAT.');
                grid_data.push(row);
            }

            /* DAMAGE */
            var group_label_postfix = num_turrets > 1 ? ' ' + Translate('(Weapon 1)') : '';
            for (var i = 0; i < num_turrets; i++) {
                if (i > 0) {
                    group_label_postfix = ' ' + Translate('(Weapon 2)');
                }
                var turret_id = Tank.turrets[i].grid_id;
                if (Weapons.loaded_data_hash[turret_id] == undefined) {
                    {
                        var row = new Object;
                        row.name = Translate('Damage');
                        row.base = Translate('no damage');
                        row.upgraded = Translate('no damage');
                        row.upgrade_change = '0';
                        row.group = ++group_prefix + ': ' + Translate('Damage');
                        grid_data.push(row);
                    }
                } else {
                    //Show damage stats only for weapon turrets
                    var weap_params = CalcWeaponRelatedParameters(Tank.turrets[i], Tank.turrets_upgraded[i]);
                    group_prefix++;
                    for (var p in weap_params) {
                        weap_params[p].group = group_prefix +': ' + weap_params[p].group + group_label_postfix;
                    }
                    grid_data = grid_data.concat(weap_params);
                }
            }
            /* SPEED */
            var group_name = ++group_prefix + ': ' + Translate('Speed');
            {
                var row = new Object;
                row.name = Translate('Speed Road');
                row.base = Tank.baseStats.speed_road;
                row.upgraded = Tank.speed_road;
                row.upgrade_change = (row.upgraded - row.base) / row.base;
                row.group = group_name
                row.descr = Translate('How fast this tank can move on road (concrete) surface.');
                grid_data.push(row);
            }
            {
                var row = new Object;
                row.name = Translate('Speed Off-Road');
                row.base = Tank.baseStats.speed_offroad;
                row.upgraded = Tank.speed_offroad;
                row.upgrade_change = (row.upgraded - row.base) / row.base;
                row.group = group_name;
                row.descr = Translate('Off-Road speed can be different. This parameter shows off-road speed for only one surface (SANDY_BUSH).');
                grid_data.push(row);
            }

            $("#designer_abilities_container").html(FormAbilitiesHtml(Tank));
            

            Designer_Draw_DPSTable('designer_dps_container', Tank.turrets_upgraded, 0);

            var container_id = "designer_parameters_container";
            DrawComponentDetailsGrid(grid_data, container_id);
            DrawPropulsionResistance('resistances_table_container', propulsion_id);

            /* Draw damage modifier for weapon turrets */
            if (Weapons.loaded_data_hash[turrets_ids[0]] == undefined) {
                $('#damage_modifier_container_weapon1').hide();
            }else
            {
                $('#damage_modifier_container_weapon1').show();
                DrawWeaponPropulsionModifiers('weapon_damage_modifiers_1', turrets_ids[0]);
            }
            if(num_turrets > 1)
            {
                if (Weapons.loaded_data_hash[turrets_ids[0]] == undefined) {
                    $('#damage_modifier_container_weapon2').hide();
                }
                {
                    $('#damage_modifier_container_weapon2').show();
                    DrawWeaponPropulsionModifiers('weapon_damage_modifiers_2', turrets_ids[1]);
                }
            }
        };

        var show_research_path_method = function (turrets_ids, body_id, propulsion_id) {

            var res_path_data = [];
            for (var t = 0; t < turrets_ids.length; t++) {
                if (turrets_ids[t] != null) {
                    res_path_data = res_path_data.concat(GetResearchPath_SubTree(turrets_ids[t], player_all_researched));
                }
            }
            if(body_id != null)
            {
                res_path_data = res_path_data.concat(GetResearchPath_SubTree(body_id, player_all_researched));
            }
            if(propulsion_id != null)
            {
                res_path_data = res_path_data.concat(GetResearchPath_SubTree(propulsion_id, player_all_researched));
            }

            $("#designer_researchpath_container").html('<button id="show_res_path" type="button">Show Research paths...</button>');
            $("#show_res_path").button().click(function (event) {
                ShowLoading('tabs_left');
                setTimeout(function () {
                    DrawResearchPath_Tree("designer_researchpath_container", res_path_data);
                    HideLoading('tabs_left');
                }, 200);
                event.preventDefault();
            });
            

        }
        
        var research_time = $('#designer_research_slider').slider("option", "value");

        if (last_calculated_research_time != research_time) {
            DoResearch(research_time, player, function (finished_research) {
                last_calculated_research_time = research_time;
                if (is_unfinished_design) {
                    if (turret1 != null) {
                        $("#designer_abilities_container").html(Form_Weapon_Abilities_html(turret1));
                    }
                }else{
                    show_params_method();
                }
                $("#designer_research_requirements").html(Form_ResearchRequirements_Html(turrets_ids, body_id, propulsion_id));

                show_research_path_method(turrets_ids, body_id, propulsion_id);
            });
        } else {
            if (is_unfinished_design) {
                if (turret1 != null) {
                    var html_tmp = "";
                    $("#designer_abilities_container").html(Form_Weapon_Abilities_html(turret1));
                }
            }else{
                show_params_method();
            }
            $("#designer_research_requirements").html(Form_ResearchRequirements_Html(turrets_ids, body_id, propulsion_id));
            show_research_path_method(turrets_ids, body_id, propulsion_id);
        }

        if (!is_unfinished_design) {
            $('#designer_all_data_container').show(); //design finished, can show parameters
            UpdateDesignurl(body_id, propulsion_id, turrets_ids);
            /* Draw comments area */
            
        }

        if (callback_function != undefined) {
            callback_function();
        }
    });
}

function DrawComponentDetailsGrid(grid_data, container_id) {
    var grid_element_id = ResetGridContainer(container_id);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: 'auto',
        colModel:
            [
                { name: "", width: '20px', sortable: false, search: false },
                { name: "name", label: Translate('Parameter'), key: true, width: '200px' },
                {
                    name: "base", label: Translate('Base value'), width: '60px', fixed: true,
                    formatter: function (cellvalue, options, rowObject) {
                        if (typeof cellvalue != "string" && isNaN(cellvalue)) {
                            return '';
                        }
                        return cellvalue;
                    }
                },
                { name: "group", label: Translate('group'), width: '100px' },
                {
                    name: "upgraded", label: Translate('Upgraded value'), width: '60px', fixed: true,
                    formatter: function (cellvalue, options, rowObject) {
                        if (typeof cellvalue != "string" && isNaN(cellvalue)) {
                            //return '<div style="width:100%;height:100%;background: lightgray;></div>'
                            return '';
                        }
                        if (cellvalue == rowObject.base) {
                            //return '<div style="width:100%;height:100%;background: lightgray;></div>'
                            return '';
                        }
                        return cellvalue;
                    }
                },
                {
                    name: "upgrade_change", label: Translate('Upgrade Change'), width: '60px',fixed:true,
                    formatter: function (cellvalue, options, rowObject) {
                        if (isNaN(cellvalue)) {
                            return '';
                        } else {
                            var fl = (parseFloat(cellvalue) * 100).toFixed(0);
                            if (fl == 0) {
                                return '';
                            } else {
                                return "<label>" + fl + "%</label>";
                            }
                        }
                    },

                },
                {
                    name: "descr", label: Translate('Description'), width: '300px', fixed: true,
                    formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue == undefined) {
                            cellvalue = ' - ';
                        }
                        return '<label style="color:gray;font-size:0.9em">' + cellvalue +'</label>'
                    },

                },
            ],
        onSelectRow: function (rowid) {

        },
        loadonce: true,
        grouping: true,
        groupingView: {
            groupField: ['group'],
            groupText: ['<b> {0} </b>'],
            groupColumnShow: [false]
        },
    });
}

function CalcWeaponRelatedParameters(weapon_base, weapon_upgraded) {

    var grid_data = [];
    var turret = weapon_base;
    var turret_upgraded = weapon_upgraded;
    var damage1_label = Translate("Damage");
    var range_label = Translate("Range");
    {
        var row = new Object;
        row.name = Translate('Damage');
        row.base = turret.damage;
        row.upgraded = turret_upgraded.damage.toInt();
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Damage dealt to enemy unit with each one shot.');
        grid_data.push(row);
    }
    {
        var row = new Object;
        row.name = Translate('Damage Type');
        row.base = turret.weaponClass;
        row.upgraded = '';
        row.group = damage1_label;
        row.descr = Translate('Type of damage. KINETIC damage affected by Kinetic armor. HEAT damage affected by Thermal armor.');
        grid_data.push(row);
    }
    if(turret.radiusDamage != undefined)
    {
        var row = new Object;
        row.name = Translate('Splash Damage');
        row.base = turret.radiusDamage;
        row.upgraded = turret_upgraded.radiusDamage.toInt();
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Damage dealt to area. This damage does not affect main target of attack.');
        grid_data.push(row);
    }
    if (turret.radius != undefined)
    {
        var row = new Object;
        row.name = Translate('Splash Radius (tiles)');
        row.base = turret.radius / 128;
        row.upgraded = turret_upgraded.radius / 128;
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Radius of splash damage. Bigger readium means Splash damage will affect more enemy units.');
        grid_data.push(row);
    }
    {
        var row = new Object;
        row.name = Translate('Shots per min (rate-of-fire)');
        row.base = Weapon_ShotsPerMinute(turret).toFixed(2);
        row.upgraded = Weapon_ShotsPerMinute(turret_upgraded).toFixed(2);
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Rate-of-fire.');
        grid_data.push(row);
    }
    if (turret.reloadTime != undefined)
    {
        var row = new Object;
        row.name = Translate('Salvo reload (sec)');
        row.base = turret.reloadTime/10;
        row.upgraded = turret_upgraded.reloadTime / 10;
        row.upgrade_change = ((row.upgraded - row.base) / row.base);
        row.group = damage1_label;
        row.descr = Translate('Time to reload salvo weapon (seconds)');
        grid_data.push(row);
    }

    if (turret.periodicalDamage != undefined)
    {
        var row = new Object;
        row.name = Translate('Period. damage');
        row.base = turret.periodicalDamage;
        row.upgraded = turret_upgraded.periodicalDamage.toInt();
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Additional damage per second. Note: periodical damage affects only enemy units which are stay in \'inflamed area\'');
        grid_data.push(row);
    }
    if (turret.periodicalDamageTime != undefined)
    {
        var row = new Object;
        row.name = Translate('Period. time (seconds)');
        row.base = turret.periodicalDamageTime / 10;
        row.upgraded = turret_upgraded.periodicalDamageTime / 10;
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Duration of periodical damage.');
        grid_data.push(row);
    }
    if (turret.periodicalDamageRadius != undefined)
    {
        var row = new Object;
        row.name = Translate('Period. radius (tiles)');
        row.base = turret.periodicalDamageRadius / 128;
        row.upgraded = turret_upgraded.periodicalDamageRadius / 128;
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Radius of periodical damage.');
        grid_data.push(row);
    }
    /* RANGE */
    {
        var row = new Object;
        row.name = Translate('Range (tiles)');
        row.base = PropDescr("longRange_tiles").format_str(turret.longRange);
        row.upgraded = PropDescr("longRange_tiles").format_str(turret_upgraded.longRange);
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = range_label;
        row.descr = Translate('Maximum range of fire.');
        grid_data.push(row);
    }
    /* VTOL Related parameters */
    if (CalcVTOL_numshots(weapon_base)) //check if weapon is vtol-weapon
    {
        //var vtol_ammo = CalcVTOL_numshots(weapon_base);
        var row = new Object;
        row.name = Translate('Ammo');
        row.base = PropDescr("vtol_numShots").format_str(CalcVTOL_numshots(weapon_base));
        row.upgraded = PropDescr("vtol_numShots").format_str(CalcVTOL_numshots(turret_upgraded));
        row.upgrade_change = (row.upgraded - row.base) / row.base;
        row.group = damage1_label;
        row.descr = Translate('Ammo of VTOL-weapon.');
        grid_data.push(row);
    }
    return grid_data;
}

function GetResearchPath_SubTree(component_id, player,expand_level) {
    if (expand_level == undefined) {
        expand_level = 1;
    }
    if(player == undefined)
    {
        player = player_all_researched;
    }
    var result_data = [];
    var row_index = 0;
    var res_comp_row = ResearchedComponents[player][component_id];
    if (res_comp_row == undefined) {
        var data_row = {};
        data_row.id = component_id + row_index++;
        data_row.parent = null;
        data_row.research_id = null;
        data_row.calculated_time = null;
        data_row.level = 0;
        data_row.isLeaf = true;
        data_row.expanded = true;
        data_row.name = component_id;
        result_data.push(data_row);
        return result_data;
    }

    var res_row = Researches.loaded_data_hash[res_comp_row.research_id];
    if (res_row == undefined) {
        return result_data;
    }
    var add_pre_res_method = function (parent_res_id, res_row, level) {
        if (level <= -50) {
            return; //in case infinite recursion
        }
        
        var data_row = {};
        data_row.id = component_id + row_index++;
        data_row.parent = parent_res_id;
        data_row.research_id = res_row.grid_id;
        data_row.calculated_time = ResearchTime[player][res_row.grid_id];
        data_row.level = level;
        data_row.isLeaf = true;
        data_row.expanded = level >= -1 * expand_level;
        data_row.name = res_row.name;
        result_data.push(data_row);

        if (res_row.requiredResearch == undefined) {
            return;
        } else {
            var pre_res = res_row.requiredResearch;
            if (pre_res.length > 0) {
                data_row.isLeaf = false;
            }
            for (var i = 0; i < pre_res.length; i++) {
                if (Researches.loaded_data_hash[pre_res[i]] != undefined) {
                    if (data_row.research_id != Researches.loaded_data_hash[pre_res[i]].grid_id) {
                        add_pre_res_method(data_row.id, Researches.loaded_data_hash[pre_res[i]], level - 1);
                    }
                }
            }
        }
    };
    add_pre_res_method(null, res_row, 0);
    for (var i = 0; i < result_data.length; i++) {
        result_data[i].level = Math.abs(result_data[i].level);
    }
    return result_data;
}

function DrawResearchPath_Tree(container_id, data_research_path) {
    var grid_element_id = ResetGridContainer(container_id);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        //caption: RightTreeObject.LeftTreeItemsCaption + "  " + NameOfRootItem,
        datatype: "jsonstring",
        datastr: data_research_path,
        rowNum: data_research_path.length,
        height: 'auto',
        //height: $(window).height() - $("#" + RightTreeObject.Grid_ContainerName).offset().top - 80,
        //scrollerbar: true,
        treeGridModel: 'adjacency',
        colModel: [
            { label: "id", name: "id", width: 1, hidden: true, key: true },
            {
                label: Translate("Research Name"), name: "name",
                formatter: function (cellvalue, options, rowObject) {
                    var res_html = '<span class="span_button"><a style="text-decoration:none" href="Research.html?details_id=' + rowObject.research_id + '">' + cellvalue + '<a/></span>';
                    if (rowObject.level == 0) {
                        res_html = '<b>' + res_html +'</b>';
                    }
                    var time = Translate('cant research(!)');
                    if (rowObject.calculated_time != undefined) {
                        if (rowObject.calculated_time < 3600) {
                            time = rowObject.calculated_time.toMMSS();
                        } else {
                            time = rowObject.calculated_time.toHHMMSS();
                        }
                    }
                    return res_html + " <label style='font-size:0.8em;color:grey'>(" + time + ")</label>";
                }
            },
            //{
            //    label: "Time",
            //    name: "calculated_time",
            //    formatter: function (cellvalue, options, rowObject) {
            //        if (cellvalue == undefined) {
            //            return 'cant research(!)';
            //        }
            //        if (cellvalue < 3600) {
            //            return cellvalue.toMMSS();
            //        } else {
            //            return cellvalue.toHHMMSS();
            //        }
            //    },
            //    sorttype: "int",
            //    width: 20,
            //    hidden: true,
            //}
        ],
        treeGrid: true,
        ExpandColumn: "name",
        //ExpandColClick: true,
        autowidth: true,
        sortname: "id",
        treeReader: {
            level_field: "level",
            parent_id_field: "parent",
            leaf_field: "isLeaf",
            expanded_field: "expanded"
        },
        gridComplete: function () {
            grid.parents("div.ui-jqgrid-view").children("div.ui-jqgrid-hdiv").hide();
        },
    });
    grid.SortTree(1);
}

function GetTurretDataRow(turret_id, non_weapon_design) {
    if(non_weapon_design == true)
    {
        for (var i = 0; i < Objects.length; i++) {
            if (Objects[i].loaded_data_hash != undefined) {
                var t = Objects[i].loaded_data_hash[turret_id];
                if (t != undefined) {
                    return t;
                }
            }
        }
    }else
    {
        return Weapons.loaded_data_hash[turret_id];
    }
}

function GetTurretUpgrade(player, turret_id, non_weapon_design) {
    if (non_weapon_design == true || non_weapon_design == undefined) {
        for (var i = 0; i < Objects.length; i++) {
            if (Objects[i].loaded_data_hash != undefined) {
                var t = Objects[i].loaded_data_hash[turret_id];
                if (t != undefined) {
                    if (Objects[i] == Construction) {
                        return Upgrades[player].Construct;
                    }
                    if (Objects[i] == Repair) {
                        return Upgrades[player].Repair;
                    }
                    if (Objects[i] == Sensor) {
                        return Upgrades[player].Sensor;
                    }
                    if (Objects[i] == ECM) {
                        return Upgrades[player].ECM;
                    }
                    if (Objects[i] == Weapons) {
                        return Upgrades[player].Weapon;
                    }
                }
            }
        }
    } else {
        return Upgrades[player].Weapon;
    }
}

function CalculateTankDesign(player, turrets, body, propulsion, non_weapon_design) {

    var turrets_num = 1;
    if ($.isArray(turrets)) {
        if (turrets.length > 1) {
            turrets_num = 2;
        }
    } else {
        turrets = [turrets];
    }

    var turrets_upgraded = [];
    var turret_name = "";
    for(var i=0; i<turrets_num; i++)
    {
        turret_name += turrets[i].name + " ";
        turrets_upgraded[i] = jQuery.parseJSON(JSON.stringify(GetTurretUpgrade(player, turrets[i].grid_id, non_weapon_design)[turrets[i].index_of_datarow])); //deep copy
    }
    
    var body_upgraded = jQuery.parseJSON(JSON.stringify(Upgrades[player].Body[body.index_of_datarow])); //deep copy

    var TankDesign = {};
    TankDesign.name = turret_name + body.name + ' ' + propulsion.name;
    TankDesign.turrets = jQuery.parseJSON(JSON.stringify(turrets)); //deep copy
    TankDesign.turrets_upgraded = turrets_upgraded;
    TankDesign.body = jQuery.parseJSON(JSON.stringify(body)); //deep copy
    TankDesign.body_upgraded = body_upgraded;
    TankDesign.propulsion = jQuery.parseJSON(JSON.stringify(propulsion)); //deep copy
    TankDesign.baseStats = {};

    //add weapon stats to TankDesign object
    //CalculateWeaponStats_AddToObjects(player, turret, TankDesign, TankDesign.baseStats, TankDesign, non_weapon_design);

    /* HP, ARMOR */
    {
        var turret_hp = 0;
        for (var i = 0; i < turrets_num; i++) {
            turret_hp += turrets[i].hitpoints == undefined ? 0 : turrets[i].hitpoints;
        }
        var hp = body.hitpoints + (body.hitpoints * propulsion.hitpoints) / 100 + turret_hp;
        var percent_upgrade = body_upgraded.hitpoints_percentage == undefined ? 0 : body_upgraded.hitpoints_percentage;
        TankDesign.baseStats.hitpoints = hp;
        TankDesign.hitpoints = hp + hp * percent_upgrade / 100;
    }

    TankDesign.baseStats.armourKinetic = body.armourKinetic;
    TankDesign.armourKinetic = body_upgraded.armourKinetic;

    TankDesign.baseStats.armourHeat = body.armourHeat;
    TankDesign.armourHeat = body_upgraded.armourHeat;


    /* SPEED */
    var turret_weight = 0;
    for (var i = 0; i < turrets_num; i++) {
        turret_weight += turrets[i].weight == undefined ? 0 : turrets[i].weight;
    }
    var weight = body.weight + (body.weight * propulsion.weight) / 100 + turret_weight;
    var prop_modifier = PropulsionType.loaded_data_hash[propulsion.type].multiplier;
    var vtol_speed_modifier = 1;
    var speed_bonus = 1;
    if (body.powerOutput > weight) {
        speed_bonus = 1.5;
    }
    TankDesign.speed_bonus = speed_bonus;
    if (propulsion.type == 'Lift') {
        if (body.size == "HEAVY") {
            vtol_speed_modifier = 0.25;
        } else if (body.size == "MEDIUM") {
            vtol_speed_modifier = 0.75;
        }
    }
    var terrain_modifier_road = TerrainTable.loaded_data_hash["6"].speedFactor[PropulsionType.loaded_data_hash[propulsion.type].index_of_datarow];
    var terrain_modifier_sandybush = TerrainTable.loaded_data_hash["1"].speedFactor[PropulsionType.loaded_data_hash[propulsion.type].index_of_datarow];

    var engine_base = (body.powerOutput * prop_modifier) / 100 * vtol_speed_modifier * speed_bonus;
    var engine_upgraded = (body_upgraded.powerOutput * prop_modifier) / 100 * vtol_speed_modifier * speed_bonus;

    TankDesign.baseStats.speed_road = Math.min(propulsion.speed / 100 / 1.28, engine_base * terrain_modifier_road / weight / 100 / 1.28).toFixed(2);
    TankDesign.speed_road = Math.min(propulsion.speed / 100 / 1.28, engine_upgraded * terrain_modifier_road / weight / 100 / 1.28).toFixed(2);

    TankDesign.baseStats.speed_offroad = Math.min(propulsion.speed / 100 / 1.28, engine_base * terrain_modifier_sandybush / weight / 100 / 1.28).toFixed(2);;
    TankDesign.speed_offroad = Math.min(propulsion.speed / 100 / 1.28, engine_upgraded * terrain_modifier_sandybush / weight / 100 / 1.28).toFixed(2);

    /* PRICE, BUILD POINTS, BUILD TIME */
    var fact_build_points;
    var fact_build_points_upgraded;

    if (propulsion.type == 'Lift') {
        fact_build_points = Structures.loaded_data_hash['A0VTolFactory1'].productionPoints; // per second
        fact_build_points_upgraded = Upgrades[player].Building[Structures.loaded_data_hash['A0VTolFactory1'].index_of_datarow].productionPoints; // per second
    } else if (propulsion.type == 'Legged') {
        fact_build_points = Structures.loaded_data_hash['A0CyborgFactory'].productionPoints; // per second
        fact_build_points_upgraded = Upgrades[player].Building[Structures.loaded_data_hash['A0CyborgFactory'].index_of_datarow].productionPoints; // per second
    } else {
        fact_build_points = Structures.loaded_data_hash['A0LightFactory'].productionPoints; // per second
        fact_build_points_upgraded = Upgrades[player].Building[Structures.loaded_data_hash['A0LightFactory'].index_of_datarow].productionPoints; // per second
    }

    var turret_buildPower = 0;
    var turret_buildPoints = 0;
    for (var i = 0; i < turrets_num; i++) {
        turret_buildPower += turrets[i].buildPower == undefined ? 0 : turrets[i].buildPower;
        turret_buildPoints += turrets[i].buildPoints == undefined ? 0 : turrets[i].buildPoints;
    }

    TankDesign.baseStats.price = turret_buildPower + body.buildPower + body.buildPower * propulsion.buildPower / 100;
    TankDesign.price = turret_buildPower + body_upgraded.buildPower + body_upgraded.buildPower * propulsion.buildPower / 100;

    TankDesign.baseStats.buildPoints = turret_buildPoints + body.buildPoints + body.buildPoints * propulsion.buildPoints / 100;
    TankDesign.buildPoints = turret_buildPoints + body_upgraded.buildPoints + body_upgraded.buildPoints * propulsion.buildPoints / 100;

    TankDesign.baseStats.buildTimeSeconds_factory_nomodules = TankDesign.baseStats.buildPoints / fact_build_points;
    TankDesign.buildTimeSeconds_factory_nomodules = TankDesign.buildPoints / fact_build_points_upgraded;

    if (propulsion.type == 'Legged') {
        TankDesign.baseStats.buildTimeSeconds_factory_with2modules = 0;
        TankDesign.buildTimeSeconds_factory_with2modules = 0;
    } else {
        TankDesign.baseStats.buildTimeSeconds_factory_with2modules = TankDesign.baseStats.buildPoints / (fact_build_points * 3);
        TankDesign.buildTimeSeconds_factory_with2modules = TankDesign.buildPoints / (fact_build_points * 2 + fact_build_points_upgraded);
    }

    return TankDesign;
}

function CalculateBuilding(player, structure) {

    var StructureDesign;
    var structure_upgraded = jQuery.parseJSON(JSON.stringify(Upgrades[player].Building[structure.index_of_datarow])); //deep copy
    StructureDesign = {};
    StructureDesign.baseStats = {};

    if (structure.weapons != undefined) {
        var weapons = structure.weapons;
        if (weapons) {
            var weapon = Weapons.loaded_data_hash[weapons[0]];
            //var weapon_upgraded = jQuery.parseJSON(JSON.stringify(Upgrades[player].Weapon[weapon.index_of_datarow])); //deep copy
            //add weapon stats to TankDesign object
            CalculateWeaponStats_AddToObjects(player, weapon, StructureDesign, StructureDesign.baseStats, StructureDesign);
        }
    }

    /* SENSOR RANGE */
    if (structure.sensorID != undefined) {
        var sensor = Sensor.loaded_data_hash[structure.sensorID];
        var sensor_upgraded = jQuery.parseJSON(JSON.stringify(Upgrades[player].Sensor[sensor.index_of_datarow])); //deep copy
        if (sensor != undefined) {
            StructureDesign.baseStats.sensorRange = sensor.range;
            StructureDesign.sensorRange = sensor_upgraded.range;
        }
    }

    /* HP, ARMOR */
    //var hp = structure.hitpoints;
    //StructureDesign.baseStats.hitpoints = hp;
    //StructureDesign.hitpoints = hp + hp * structure_upgraded.hitpoints / 100;
    StructureDesign.baseStats.hitpoints = structure.hitpoints;
    StructureDesign.hitpoints = structure_upgraded.hitpoints;

    //var armor = structure.armour;
    //StructureDesign.baseStats.armourKinetic = armor;
    //StructureDesign.armourKinetic = armor + armor * structure_upgraded.armour / 100;
    StructureDesign.baseStats.armourKinetic = structure.armour;
    StructureDesign.armourKinetic = structure_upgraded.armour;
    //StructureDesign.baseStats.armourHeat = armor;
    //StructureDesign.armourHeat = armor + armor * structure_upgraded.armour / 100;
    StructureDesign.baseStats.armourHeat = structure.armour;
    StructureDesign.armourHeat = structure_upgraded.armour;

    /* PRICE, BUILD POINTS, BUILD TIME */
    var truck_build_points;
    var truck_build_points_upgraded;

    truck_build_points = Construction.loaded_data_hash['Spade1Mk1'].constructPoints; // per second
    truck_build_points_upgraded = Upgrades[player].Construct[Construction.loaded_data_hash['Spade1Mk1'].index_of_datarow].constructPoints; // per second

    StructureDesign.baseStats.price = structure.buildPower;
    StructureDesign.price = structure_upgraded.buildPower;

    StructureDesign.baseStats.buildPoints = structure.buildPoints;
    StructureDesign.buildPoints = structure_upgraded.buildPoints;

    StructureDesign.baseStats.buildTimeSeconds_2_trucks = structure.buildPoints / (truck_build_points * 2);
    StructureDesign.buildTimeSeconds_2_trucks = structure_upgraded.buildPoints / (truck_build_points_upgraded * 2);

    StructureDesign.baseStats.buildTimeSeconds_4_trucks = structure.buildPoints / (truck_build_points * 4);
    StructureDesign.buildTimeSeconds_4_trucks = structure_upgraded.buildPoints / (truck_build_points_upgraded * 4);

    


    return StructureDesign;
}

function CalculateWeaponStats_AddToObjects(player, weapon, ref_object, ref_object_base, ref_object_upgraded, non_weapon_design) {

   
    var weapon_upgraded = jQuery.parseJSON(JSON.stringify(GetTurretUpgrade(player, weapon.grid_id, non_weapon_design)[weapon.index_of_datarow])); //deep copy

    ref_object.weapon = jQuery.parseJSON(JSON.stringify(weapon)); //deep copy
    ref_object.weapon_upgraded = weapon_upgraded;

    ref_object_base.weaponClass = weapon.weaponClass;
    ref_object_upgraded.weaponClass = weapon_upgraded.weaponClass;

    ref_object_base.damage = weapon.damage;
    ref_object_upgraded.damage = weapon_upgraded.damage;

    ref_object_base.radiusDamage = weapon.radiusDamage;
    ref_object_upgraded.radiusDamage = weapon_upgraded.radiusDamage;

    ref_object_base.radius = weapon.radius;
    ref_object_upgraded.radius = weapon_upgraded.radius;

    ref_object_base.shotsPerMinute = Weapon_ShotsPerMinute(weapon);
    ref_object_upgraded.shotsPerMinute = Weapon_ShotsPerMinute(weapon_upgraded);

    ref_object_base.firePause = weapon.firePause;
    ref_object_upgraded.firePause = weapon_upgraded.firePause;

    ref_object_base.reloadTime = weapon.reloadTime;
    ref_object_upgraded.reloadTime = weapon_upgraded.reloadTime;

    ref_object_base.numRounds = weapon.numRounds;
    ref_object_upgraded.numRounds = weapon_upgraded.numRounds;

    ref_object_base.periodicalDamage = weapon.periodicalDamage;
    ref_object_upgraded.periodicalDamage = weapon_upgraded.periodicalDamage;

    ref_object_base.periodicalDamage = weapon.periodicalDamage;
    ref_object_upgraded.periodicalDamage = weapon_upgraded.periodicalDamage;

    ref_object_base.periodicalDamageTime = weapon.periodicalDamageTime;
    ref_object_upgraded.periodicalDamageTime = weapon_upgraded.periodicalDamageTime;

    ref_object_base.periodicalDamageRadius = weapon.periodicalDamageRadius;
    ref_object_upgraded.periodicalDamageRadius = weapon_upgraded.periodicalDamageRadius;

    ref_object_base.longRange = weapon.longRange;
    ref_object_upgraded.longRange = weapon_upgraded.longRange;

    /* VTOL Stuff */
    ref_object_base.vtol_numShots = CalcVTOL_numshots(weapon);
    ref_object_upgraded.vtol_numShots = ref_object_base.vtol_numShots;

}


function CalcDPSToTopBody(player_attacker, player_attacked, attack_weapon) {

}

function WeaponDamage_htmlCell(rowObject) {
    var html_res = "";
    if (rowObject.damage != undefined) {
        var dmg = PropDescr('damage').format_str(rowObject.damage);
        if (rowObject.weaponClass == "HEAT") {
            html_res += "<label style='color: darkred'><b>" + dmg + "</b></label>";
            html_res += " " + Translate(rowObject.weaponClass.toLowerCase()) + "";
        } else {
            html_res += "<b>" + dmg + "</b>";
        }
    }

    if (rowObject.radiusDamage != undefined && rowObject.radius != undefined) {
        var rad_dmg = PropDescr('radiusDamage').format_str(rowObject.radiusDamage);
        html_res += "</br>";
        if (rowObject.weaponClass == "HEAT") {
            html_res += "<label style='color: darkred'><b>" + rad_dmg + "</b></label> /" + (rowObject.radius / 128).toFixed(1) + " " + Translate("tiles");
            html_res += " " + Translate(rowObject.weaponClass.toLowerCase()) + "";
        } else {
            html_res += "<b>" + rad_dmg + " /" + (rowObject.radius / 128).toFixed(1) + " " + Translate("tiles") + "</b>";
        }
    }

    if (rowObject.periodicalDamage != undefined && rowObject.periodicalDamageRadius != undefined && rowObject.periodicalDamageTime != undefined) {
        html_res += "</br>";
        var period_dmg = PropDescr('periodicalDamage').format_str(rowObject.periodicalDamage);
        if (rowObject.periodicalDamageWeaponClass == "HEAT") {
            html_res += "<label style='color: darkred'><b>" + period_dmg + "</label></b> /sec" + "";
            html_res += " " + Translate(rowObject.periodicalDamageWeaponClass.toLowerCase()) + "";
        } else {
            html_res += "<b>" + period_dmg + " /" + Translate("sec") + "</b>";
        }
    }
    return html_res;
}

function CalcVTOL_numshots(weapon) {
    return (weapon.numAttackRuns == undefined ? 0 : weapon.numAttackRuns) * (weapon.numRounds == undefined ? 1 : weapon.numRounds);
}

function UpdateDesignurl(body_id, propulsion_id, turrets_ids) {
    var turret1_id = turrets_ids[0]
    if(turrets_ids.length > 1)
    {
        var turret2_id = turrets_ids[1]
        url_pushState('?body_id=' + body_id + '&propulsion_id=' + propulsion_id + '&turret1_id=' + turret1_id + '&turret2_id=' + turret2_id);
    }else
    {
        url_pushState('?body_id=' + body_id + '&propulsion_id=' + propulsion_id + '&turret1_id=' + turret1_id);
    }
}


function DrawPropulsionResistance(container_id, propulsion_id) {
    var propulsion = Propulsion.loaded_data_hash[propulsion_id];
    var grid_data_mdf = [];
    for (var weap_class in PropulsionModifiers.loaded_data_hash) {
        grid_data_mdf.push({
            weap_class: weap_class,
            resist: Math.floor(100 / PropulsionModifiers.loaded_data_hash[weap_class][propulsion.type] * 100 - 100) + '%',
        });
    }

    var grid_element_id = ResetGridContainer(container_id);
    $('<div style="padding:5px">' + Translate('Propulsion type')+': <b>' + Translate(propulsion.type) + '</b></div>').insertBefore(grid_element_id);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data_mdf,
        rowNum: grid_data_mdf.length,
        height: '100%',
        colModel:
            [
                { name: "weap_class", label: Translate("Weapon class"), width: '150px', fixed: true },
                { name: "resist", label: Translate("Resistance"), width: '80px', fixed: true },
            ],
        loadonce: true,
    });
}
function DrawWeaponPropulsionModifiers(container_id, weapon_id) {
    var weapon = Weapons.loaded_data_hash[weapon_id];
    var grid_data_mdf = [];
    var modif = PropulsionModifiers.loaded_data_hash[weapon.weaponEffect];
    for (var prop_type in PropulsionType.loaded_data_hash) {
        grid_data_mdf.push({
            propulsion: Translate(prop_type),
            modifier: modif[prop_type] == undefined ? ' - ' : modif[prop_type] + '%',
        });
    }

    if (StructureModifiers.loaded_data_hash[weapon.weaponEffect] != undefined) {
        grid_data_mdf.push({
            propulsion: Translate('MEDIUM'),
            modifier: StructureModifiers.loaded_data_hash[weapon.weaponEffect]['MEDIUM'] + '%',
        });
        grid_data_mdf.push({
            propulsion: Translate('HARD'),
            modifier: StructureModifiers.loaded_data_hash[weapon.weaponEffect]['HARD'] + '%',
        });
        grid_data_mdf.push({
            propulsion: Translate('BUNKER'),
            modifier: StructureModifiers.loaded_data_hash[weapon.weaponEffect]['BUNKER'] + '%',
        });
    }

    var grid_element_id = ResetGridContainer(container_id);
    $('<div style="padding:5px">' + Translate('Weapon type') +': <b>' + weapon.weaponEffect + '</b></div>').insertBefore(grid_element_id);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data_mdf,
        rowNum: grid_data_mdf.length,
        height: '100%',
        colModel:
            [
                { name: "propulsion", label:' ', width: '150px', fixed: true },
                { name: "modifier", label: Translate('modifier'), width: '50px', fixed: true },
            ],
        loadonce: true,
    });
}

function DrawWeaponUpgradeTable(container_id, weapon_id, research_hint) {
    var weapon = Weapons.loaded_data_hash[weapon_id];
    var weapon_upgraded = GetTurretUpgrade(player_all_researched, weapon_id, false)[weapon.index_of_datarow];
    var upgrade_log = weapon_upgraded.upgrade_history;
    var grid_data = [];
    var summ = 0;
    for (var i in upgrade_log) {
        var log_rec = upgrade_log[i];
        var research = Researches.loaded_data_hash[log_rec.research_id];
        if (log_rec.hint.toLowerCase() == research_hint.toLowerCase()) {
            summ = summ + log_rec.value;
            var shown_val;
            if (research_hint == "firePause") {
                shown_val = Math.floor(100 / (100 + summ) * 100 - 100); //assume firePause setter as negative value
            } else {
                shown_val = summ;
            }
            grid_data.push({
                name: research.name,
                time_int: ResearchTime[player_all_researched][log_rec.research_id],
                //value: (weapon[research_hint] + weapon[research_hint] * summ/100).toInt(),
                summ: shown_val,
            });
        }
    }

    var grid_element_id = ResetGridContainer(container_id);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data,
        rowNum: grid_data.length,
        height: '100%',
        colModel:
            [
                { name: "name", label: Translate("Research"), width: '200px', fixed: true },
                { name: "time_int", width: '50px', fixed: true, hidden: true, sorttype: "int", },
                {
                    label: Translate("Research Time (min)"),
                    width: 80,
                    formatter: function (cellvalue, options, rowObject) {
                        if (rowObject.time_int == undefined) {
                            return '<label style="color:gray;font-size:0.9em;">' +  Translate('cant research(!)') +'</label>';
                        }
                        if (rowObject.time_int < 3600) {
                            return rowObject.time_int.toMMSS();
                        } else {
                            return rowObject.time_int.toHHMMSS();
                        }
                    },
                },
                { name: "summ", label: Translate("Summ Upgrade value"), width: '50px', fixed: true, formatter: function (cellvalue, options, rowObject) { return cellvalue + '%' } },
               // { name: "value", label: "Upgrade value", width: '70px', fixed: true },
            ],
        sortname: "time_int",
        loadonce: true,
    });
}

function DrawStructureResistance(container_id, structure_id) {
    var structure = Structures.loaded_data_hash[structure_id];
    var grid_data_mdf = [];
    for (var weap_class in StructureModifiers.loaded_data_hash) {
        grid_data_mdf.push({
            weap_class: weap_class,
            resist: Math.floor(100 / StructureModifiers.loaded_data_hash[weap_class][structure.strength] * 100 - 100) + '%',
        });
    }

    var grid_element_id = ResetGridContainer(container_id);
    $('<div style="padding:5px">' + Translate('Structure type') + ': <b>' + structure.strength + '</b></div>').insertBefore(grid_element_id);
    var grid = $(grid_element_id);
    grid.jqGrid
    ({
        datatype: "local",
        data: grid_data_mdf,
        rowNum: grid_data_mdf.length,
        height: '100%',
        colModel:
            [
                { name: "weap_class", label: Translate("Weapon class"), width: '150px', fixed: true },
                { name: "resist", label: Translate("Resistance"), width: '80px', fixed: true },
            ],
        loadonce: true,
    });
}

