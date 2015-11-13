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
            uppercase: true,
            enum: ['M', 'F']
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
        partisan_check: Boolean,
        partisan_country: String,
        service_check: Boolean,
        service_country: String
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
    resume: String,
    personal_story: String,
    images: [{
        //img: { data: Buffer, contentType: String },
        title: String,
        src: String
    }],
    links: [{
        href: String,
        title: String
    }],
	approved : { type: Boolean, default: false },
});

warriorSchema.index({ 'personal_information.first_name': 'text', 'personal_information.last_name': 'text',
    'ww2.partisan_country': 'text', 'ww2.service_country': 'text'
});

warriorSchema.plugin(mongoosePaginate);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Warrior', warriorSchema);
