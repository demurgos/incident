# Incident

Simple custom errors

Features:

* Track error causes (simple chain or multiple reasons)
* Based on native `Error`s, full compatibility
* Support for `instanceof`
* Easy name and data association for automated error handling
* Possibility to extends via standard JS inheritance to provide custom errors
* built with TypeScript: type definition and ES6 builds available

Planned features:  

* Better compatibility between errors defined in distinct modules
* Better support for message custom formatting (ie. for L10n)

## Usage ##

````javascript
let err;

err =  new Incident();
err = new Incident(message);
err = new Incident(name, message);
err = new Incident(name, data, message);
err = new Incident(cause, message);
err = new Incident(cause, name, message);
err = new Incident(cause, name, data, message);
````

````typescript
interface Incident {
  cause: Error;
  name: string;
  data: {[key: string]: any};
  message: string;
  stack: string;
}
````
