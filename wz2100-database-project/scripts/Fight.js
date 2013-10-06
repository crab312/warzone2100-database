
var TankShape;

$(function () {
    TankShape = {};
    TankShape["LIGHT"] = {};
    TankShape["LIGHT"]["Wheeled"] = {width: 64, height: 64};
    TankShape["LIGHT"]["Half-Tracked"] = { width: 64, height: 64 };
    TankShape["LIGHT"]["Tracked"] = { width: 70, height: 64 };
    TankShape["LIGHT"]["Hover"] = { width: 60, height: 64 };
    TankShape["LIGHT"]["Legged"] = { width: 40, height: 40 };
    TankShape["LIGHT"]["Lift"] = { width: 64, height: 64 };
    TankShape["LIGHT"]["Propellor"] = { width: 64, height: 70 };

    TankShape["MEDIUM"] = {};
    TankShape["MEDIUM"]["Wheeled"] = { width: 86, height: 86 };
    TankShape["MEDIUM"]["Half-Tracked"] = { width: 86, height: 86 };
    TankShape["MEDIUM"]["Tracked"] = { width: 90, height: 86 };
    TankShape["MEDIUM"]["Hover"] = { width: 80, height: 86 };
    TankShape["MEDIUM"]["Legged"] = { width: 40, height: 40 };
    TankShape["MEDIUM"]["Lift"] = { width: 86, height: 86 };
    TankShape["MEDIUM"]["Propellor"] = { width: 86, height: 95 };

    TankShape["HEAVY"] = {};
    TankShape["HEAVY"]["Wheeled"] = { width: 100, height: 120 };
    TankShape["HEAVY"]["Half-Tracked"] = { width: 100, height: 120 };
    TankShape["HEAVY"]["Tracked"] = { width: 105, height: 120 };
    TankShape["HEAVY"]["Hover"] = { width: 90, height: 128 };
    TankShape["HEAVY"]["Legged"] = { width: 40, height: 40 };
    TankShape["HEAVY"]["Lift"] = { width: 100, height: 110 };
    TankShape["HEAVY"]["Propellor"] = { width: 100, height: 128 };
});

function Fight_GetShape(TankDesign)
{
    var shape1 = TankShape[TankDesign.body.size];
    if(shape1 == undefined)
    {
        shape1 = TankShape["MEDIUM"];
    }
    var shape2 = shape1[TankDesign.propulsion.type]
    if(shape2 == undefined)
    {
        shape2 = shape1["Half-Tracked"];
    }
    return shape2;
}

function Fight_MakeFormation(TankDesign, count, is_bottom_army) {
    var army = [];

    var line_len = 10;
    var total_lines = Math.floor(count / line_len);
    var shape = Fight_GetShape(TankDesign);
    var line_space = 20;
    var cell_space = 10;
    var total_width = line_len * (shape.width + cell_space) - cell_space;
    var left_x = 0 - Math.floor(total_width / 2);

    var armies_h_distance = 256;
    var first_line_h_center;
    if (is_bottom_army) {
        first_line_h_center = 0 - armies_h_distance / 2 - shape.height / 2;
    } else {
        first_line_h_center = armies_h_distance / 2 + shape.height / 2;
    }

    for (var line = 0; line < total_lines; line++) {
        for(var cell = 0; cell < line_len; cell++)
        {
            var soldier = {};
            soldier.x = left_x + Math.floor(cell * (shape.width + cell_space) / 2);
            soldier.y = first_line_h_center + line * (shape.height + line_space);
            soldier.template = TankDesign;
            soldier.data = Query.parseJSON(JSON.stringify(TankDesign));
            soldier.expected_damage = 0;
            //soldier.targeted_enemy;
            army.push(soldier);
        }
    }

    return army;
}

function Figth_LetsFight(top_army, bottom_army) {
    while (true) {
        //...1/10 second ~ 1 Frame of THE GAME!!!

        //target selection : top_army
        for (var t = 0; t < top_army.length; t++) {
            

            for (var s = 0; s < bottom_army.length; s++) {
                if (soldier.expected_damage[i] < soldier.data.hitpoints) {

                }
            }
        }
        //target selection : bottom_army
    }
    var result = {};
    result.top_army = top_army;
    result.bottom_army = bottom_army;
    result.bottom_wins = true;

    return result;
}


function Fight_Test2SimilarArmies(Design1, Design2, price_amount) {
    var des1_count = price_amount / Design1.price;
    var des2_count = price_amount / Design2.price;

    var army1 = Fight_MakeFormation(Design1, des1_count, false);
    var army2 = Fight_MakeFormation(Design2, des2_count, true);

    return Figth_LetsFight(army1, army2);
}