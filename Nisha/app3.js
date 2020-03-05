const {MongoClient} = require('mongodb')

async function main(){
	console.log(`Starting main`);
	console.error(`error in main`);
	const uri= "mongodb+srv://miniMurali:Snowyndm@cluster0-5jxw4.mongodb.net/test?retryWrites=true&w=majority&useUnifiedTopology=true";
	const client= new MongoClient(uri)
	//const mongodb = context.services.get("mongodb-atlas")

	//To delete later
	//await client.connect();
	//await listDatabases(client);

	try{

		//await client.connect();
		//const Booths = client.db("client").collection("booths");
		//const Vendors= client.db("client").collection("vendors");

		console.log("Starting DB processing");

		//await listDatabases(client);
		//await addSampleData(Booths, Vendors);
	} catch (e){
		console.error(e);
	}

	finally {
		await client.close();
	}


	
}

main(). catch(console.log);


