var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var warriorSchema = mongoose.Schema({ 

    personal_information : { 
    	first_name: String, 
    	last_name: String,
    	army_id: String,
    	former_last_name: String,
    	father_name: String,
    	mother_name: String,
    	birth_date: Date,
    	lunar_birth_date: String,
    	birth_country: String,
    	birth_city: String,
    	migration_date: Date,
    	gender: {
            type: String,
            enum: ['male', 'female']
        }
    },
    death_details: {
        death_cause: String,
        death_date: Date,
        death_place: String
    },
    categories: [String],
    case_number: String,
    ww2: {
        jewish_community_volunteer_check: Boolean,
        partisan_check: Boolean,
        partisan_country: String,
        getto_check: Boolean,
        getto: String,
        resistance_movement_check: Boolean,
        resistance_movement_country: String,
        protest_movement_check: Boolean,
        protest_movement: String,
        service_check: Boolean,
        service_country: String,
        service_corps: String,
        service_platoon: String,
        recruitment: {
            type: String,
            enum: ['volunteer', 'enlist']
        },
        dismiss_reason: String,
        wounds_details: String
    },
    battles: [{
        soldier_rank: String,
        soldier_role: String,
        front: String,
        operation: String,
        date: String,
        medal: String,
        details: String
    }],
    prison: {
        dates: String,
        place: String,
        name: String,
        circumstances: String
    },
    idf_details: {
        corps: String,
        platoon: String,
        enlist_date: Date,
        rank: String,
        release_date: Date
    },
    idf_battles: [{
        front: String,
        operation: String,
        date: String,
        medal: String,
        details: String
    }],
    medal_links: [{
        href: String,
        title: String
    }],
    resume: String,
    personal_story: String,
    images: [{
        //img: { data: Buffer, contentType: String },
        title: String,
        src: String
    }],
    remarks: String,
    links: [{
        href: String,
        title: String
    }],
    contact_information: {
        first_name: String,
        last_name: String,
        address: String,
        city: String,
        phone: String,
        mobile_phone: String,
        email_address: String,
        relation_to_warrior: String,
        date: Date,
        first_submission: Boolean, // did this contact already submit another record
        for_display: Boolean
    },
	approved : { type: Boolean, default: false },
});

warriorSchema.index({ 'personal_information.first_name': 'text', 'personal_information.last_name': 'text',
    'ww2.partisan_country': 'text', 'ww2.service_country': 'text'
});

warriorSchema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Warrior', warriorSchema);
