const {MongoClient} = require('mongodb')

async function main(){
	console.log("Starting main");
	const uri= "mongodb+srv://miniMurali:Snowyndm@cluster0-5jxw4.mongodb.net/test?retryWrites=true&w=majority&useUnifiedTopology=true";
	

	const client= new MongoClient(uri);
	//const mongodb = context.services.get("mongodb-atlas")

	//To delete later
	//await client.connect();
	//await listDatabases(client);

	try{

		//await client.connect();
		var MongoClient
		const Booths = client.db("client").collection("booths");
		const Vendors= client.db("client").collection("vendors");
		const db = client.db("client");
		const collections = db.getCollectionNames();

		console.log("Starting DB processing");

		await listDatabases(client);
		await addSampleData(Booths, Vendors);
		await readSampleData(Booths, Vendors);
		await searchBooths(db);
		await deleteData(Booths, Vendors);
	} catch (e){
		console.error(e);
	}

	finally {
		await client.close();
	}


	//main(). catch(console.error);

}
	async function listDatabases(client){
		databasesList = await client.db().admin().listDatabases();
		console.log("Databases:");
		databasesList.databases.forEach(db => console.log(`-${db.name}`));
	};



	//to be deleted later, sample data in order to add functions that organize it later
	async function addSampleData(Booths, Vendors){

		const booth1 = {'number': 1,
		 location:"lowerCommons", "outlets":2, size:"10 x 10", "vendorID": "none"}
		let vendor1= {"vendorID": 1, "name": "Doggo", "business": "Puppy", "phone1":"111-111-1111", "email": "TennisBall@puppup.net", "phone2":"none", "tables": 3, "boothsAllocated":"yes", "addressLine1": "Woof woof", "city": "Slobberton", "state":"fluff"}
	await Booths.insertOne(booth1)
 	.then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
  	.catch(err => console.error(`Failed to insert item: ${err}`));

 	await Vendors.insertOne(vendor1)
   	.then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
  	.catch(err => console.error(`Failed to insert item: ${err}`))
	}


	async function readSampleData(Booths, Vendors){

		var boothsA= new Array;
		boothsA.push(Booths);

		var vendorsA=new Array;
		vendorsA.push(Vendors);

		

	
    		//boothsA.find(searchBooths);
    }      

	function searchBooths(db){
		
		 collections = db.getCollectionNames();
		for(var i = 0; i< collections.length; i++){    
  	 	print('Collection: ' + collections[i]); // print the name of each collection
   		db.getCollection(collections[i]).find().forEach(printjson);
   		} //and then print the json of each of its elements/
   		
	}

	 function deleteData(Booths, Vendors){
		console.log('Booths');
	}
 
 main(). catch(console.log);