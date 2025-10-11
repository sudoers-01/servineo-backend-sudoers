const createModule = require('./create');
const readModule = require('./read');
const updateModule = require('./update');
const deleteModule = require('./delete');

const Location = require('../../../models/Location');

async function test1(){
    const current_location = new Location({
        place_id: "3547294",
        licence: "https://locationiq.com/attribution",
        osm_type: "node",
        osm_id: "5597143198",
        lat: "-12.049437",
        lon: "-76.9990148",
        display_name: "Institución Educativa San Carlos, Jirón Juan Hoyle Palacios, Ancieta Alta, El Agustino, Province of Lima, Lima Metropolitan Area, Lima, 15006, Peru",
        address: {
            school: "Institución Educativa San Carlos",
            road: "Jirón Juan Hoyle Palacios",
            quarter: "Ancieta Alta",
            suburb: "El Agustino",
            city: "El Agustino",
            region: "Province of Lima",
            state_district: "Lima Metropolitan Area",
            state: "Lima",
            postcode: "15006",
            country: "Peru",
            country_code: "pe"
        },
        boundingbox: [
            "-12.049487",
            "-12.049387",
            "-76.9990648",
            "-76.9989648"
        ]
    });

    try{
        const final_location = await createModule.create_location(current_location);
        console.log('Guardado: ', final_location);
    }catch(err){
        console.error('Error: ', err);
    }
} 

async function test2(){
    try{
        const final_locations = await readModule.get_all_locations();
        console.log('Acceso Correcto: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test3(){
    try{
        const final_locations = await readModule.get_location_by_display_name('Porvenir, Quillacollo, Cochabamba, Bolivia');
        console.log('Acceso Correcto: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test4() {
    try{
        const final_locations = await readModule.get_location_by_place_id("281635359");
        console.log('Acceso Correcto: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test5(){
    const current_location = {
        "place_id": "421789356",
        "licence": "https://locationiq.com/attribution", 
        "osm_type": "node",
        "osm_id": "5987432154",
        "lat": "43.653225",
        "lon": "-79.383186",
        "display_name": "University of Toronto Schools, 371, Bloor Street West, The Annex, Toronto, Golden Horseshoe, Ontario, M5S 2R7, Canada",
        "address": {
            "school": "University of Toronto Schools",
            "house_number": "371",
            "road": "Bloor Street West",
            "suburb": "The Annex",
            "city": "Toronto",
            "region": "Golden Horseshoe",
            "state": "Ontario",
            "postcode": "M5S 2R7",
            "country": "Canada",
            "country_code": "ca"
        },
        "boundingbox": [
            "43.653175",
            "43.653275",
            "-79.383236",
            "-79.383136"
        ]
    };

    try{
        const final_location = await createModule.insert_one_location(current_location);
        console.log('Guardado: ', final_location);
    }catch(err){
        console.error('Error: ', err);
    }
}

async function test6(){
    const current_locations = [
        {
            "place_id": "125894567",
            "licence": "https://locationiq.com/attribution",
            "osm_type": "node",
            "osm_id": "5921478369",
            "lat": "48.856614",
            "lon": "2.3522219",
            "display_name": "Lycée Louis-le-Grand, 123, Rue Saint-Jacques, Quartier de la Sorbonne, 5th Arrondissement, Paris, Île-de-France, Metropolitan France, 75005, France",
            "address": {
                "school": "Lycée Louis-le-Grand",
                "house_number": "123",
                "road": "Rue Saint-Jacques",
                "suburb": "Quartier de la Sorbonne",
                "city_district": "5th Arrondissement",
                "city": "Paris",
                "region": "Île-de-France",
                "postcode": "75005",
                "country": "France",
                "country_code": "fr"
            },
            "boundingbox": [
                "48.856564",
                "48.856664",
                "2.3521719",
                "2.3522719"
            ]
        },
        {
            "place_id": "298634712",
            "licence": "https://locationiq.com/attribution",
            "osm_type": "node",
            "osm_id": "4785129631",
            "lat": "35.689487",
            "lon": "139.691706",
            "display_name": "Tokyo Metropolitan High School, 2-1, Shinjuku, Shinjuku City, Tokyo, 160-0022, Japan",
            "address": {
                "school": "Tokyo Metropolitan High School",
                "house_number": "2-1",
                "road": "Shinjuku",
                "city": "Shinjuku City",
                "state": "Tokyo",
                "postcode": "160-0022",
                "country": "Japan",
                "country_code": "jp"
            },
            "boundingbox": [
                "35.689437",
                "35.689537",
                "139.691656",
                "139.691756"
            ]
        },
        {
            "place_id": "356982147",
            "licence": "https://locationiq.com/attribution",
            "osm_type": "node",
            "osm_id": "5124789632",
            "lat": "-33.868819",
            "lon": "151.209295",
            "display_name": "Sydney Boys High School, 958, Anzac Parade, Moore Park, Sydney, Council of the City of Sydney, New South Wales, 2021, Australia",
            "address": {
                "school": "Sydney Boys High School",
                "house_number": "958",
                "road": "Anzac Parade",
                "suburb": "Moore Park",
                "city": "Sydney",
                "county": "Council of the City of Sydney",
                "state": "New South Wales",
                "postcode": "2021",
                "country": "Australia",
                "country_code": "au"
            },
            "boundingbox": [
                "-33.868869",
                "-33.868769",
                "151.209245",
                "151.209345"
            ]
        }
    ];

    try{
        const final_locations = await createModule.insert_many_locations(current_locations);
        console.log('Guardado: ', final_locations);
    }catch(err){
        console.error('Error: ', err);
    }
}

async function test7() {
    try{
        const final_locations = await readModule.get_locations_by_query_projection({}, {place_id: false});
        console.log('Acceso Correcto: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test8() {
    try{
        const final_locations = await readModule.get_locations_by_query_projection({display_name: 'University of Toronto Schools, 371, Bloor Street West, The Annex, Toronto, Golden Horseshoe, Ontario, M5S 2R7, Canada'}, {});
        console.log('Acceso Correcto: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test9() {
    try{
        const final_locations = await readModule.get_locations_by_query_projection({display_name: 'University of Toronto Schools, 371, Bloor Street West, The Annex, Toronto, Golden Horseshoe, Ontario, M5S 2R7, Canada'}, {display_name: false});
        console.log('Acceso Correcto: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test10() {
    try{
        const search_name = 'Hola ceviche!';
        const name =  'University of Toronto Schools, 371, Bloor Street West, The Annex, Toronto, Golden Horseshoe, Ontario, M5S 2R7, Canada';
        const final_location = await updateModule.update_location_fields_by_display_name(search_name, {display_name: name});
        console.log('Modificacion Correcta: ', final_location);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test11() {
    try{
        const search_names = ['Lycée Louis-le-Grand, 123, Rue Saint-Jacques, Quartier de la Sorbonne, 5th Arrondissement, Paris, Île-de-France, Metropolitan France, 75005, France',
            'Tokyo Metropolitan High School, 2-1, Shinjuku, Shinjuku City, Tokyo, 160-0022, Japan',
            'Sydney Boys High School, 958, Anzac Parade, Moore Park, Sydney, Council of the City of Sydney, New South Wales, 2021, Australia'];
        const new_name = 'bochito';
        const final_locations = await updateModule.update_many_locations_fields_by_display_name(search_names, {display_name: new_name});
        console.log('Modificaciones Correctas: ', final_locations);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test12() {
    try{
        const search_name = 'bochito';
        const name =  'Sydney Boys High School, 958, Anzac Parade, Moore Park, Sydney, Council of the City of Sydney, New South Wales, 2021, Australia';
        const final_location = await updateModule.update_location_fields_by_display_name(search_name, {display_name: name});
        console.log('Modificacion Correcta: ', final_location);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test13() {
    try{
        const search_name = 'University of Toronto Schools, 371, Bloor Street West, The Annex, Toronto, Golden Horseshoe, Ontario, M5S 2R7, Canada';
        const final_location = await deleteModule.delete_location_by_display_name(search_name);
        console.log('Eliminacion Correcta: ', final_location);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test14() {
    try{
        const search_names = ['Lycée Louis-le-Grand, 123, Rue Saint-Jacques, Quartier de la Sorbonne, 5th Arrondissement, Paris, Île-de-France, Metropolitan France, 75005, France',
            'Tokyo Metropolitan High School, 2-1, Shinjuku, Shinjuku City, Tokyo, 160-0022, Japan',
            'Sydney Boys High School, 958, Anzac Parade, Moore Park, Sydney, Council of the City of Sydney, New South Wales, 2021, Australia'];
        const final_location = await deleteModule.delete_many_locations_by_display_name(search_names);
        console.log('Eliminacion Correcta: ', final_location);
    }catch(err){
        console.log('Error: ', err);
    }
}

async function test15() {
    try{
        const search_names = ['Lycée Louis-le-Grand, 123, Rue Saint-Jacques, Quartier de la Sorbonne, 5th Arrondissement, Paris, Île-de-France, Metropolitan France, 75005, France',
            'Tokyo Metropolitan High School, 2-1, Shinjuku, Shinjuku City, Tokyo, 160-0022, Japan',
            'Sydney Boys High School, 958, Anzac Parade, Moore Park, Sydney, Council of the City of Sydney, New South Wales, 2021, Australia'];
        const query = {display_name: search_names};
        const final_location = await deleteModule.delete_many_locations_by_query(query);
        console.log('Eliminacion Correcta: ', final_location);
    }catch(err){
        console.log('Error: ', err);
    }
}

//test1();
//test2();
//test3();
//test4();
//test5();
//test6();
//test7();
//test8();
//test9();
//test10();
//test11();
//test12();
//test13();
//test14();
//test15();