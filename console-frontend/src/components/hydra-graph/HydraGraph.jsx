import React from 'react'
import { withStyles } from '@material-ui/styles';
// eslint-disable-next-line
import { DataSet, Network } from 'visjs-network';
import { node, func } from 'prop-types';

const styles = theme => ({
    graphContainer: {
        width: '100%',
        height: '82vh',
    },
});

class HydraGraph extends React.Component {
    
    constructor(props) {
        super(props);

    }
    componentDidMount(){
        debugger
        let { DataSet, Network } = require('visjs-network');
        let self = this;
        // Create Node and Edge Datasets 
        let nodes = new DataSet(this.props.apidocGraph.nodes)
        let edges = new DataSet(this.props.apidocGraph.edges)
    
        // Get reference to the mynetwork div
        let container = document.getElementById('mynetwork');
        
        let data = {
            nodes: nodes,
            edges: edges
        };
        
        // See vis.js network options for more details on how to use this
        let options = {
            interaction: { hover: true },
            nodes:{
            color: {
                hover: {
                    border: '#5BDE79',
                    background: '#5BDE79'
                  }
            }}
        };
        // Create a network
        // eslint-disable-next-line
        let endpoint;
        let check =0;
        let endpoints=null;
        
        for(let index in this.props.hydraClasses){
          if(this.props.hydraClasses[index]['@id'] === 'vocab:EntryPoint'){
              endpoints = this.props.hydraClasses[index].supportedProperty
            }
        }
        
        let network = new Network(container, data, options);
        this.selectedNode=function(e){
            this.props.selectNode(e)
        }
network.on("hoverNode", function(event){
         check=0;
         let node = event.node;
         let element_array= Object.keys(data.nodes._data).map(function (key) { 
            return data.nodes._data[key]; 
       }); 
   
   element_array.forEach(element=>{
                
        if (element.id==node)
         {
           endpoint = element;
           endpoints.forEach(endpoints=>{
            if(endpoints.property.label==endpoint.label)
              {
                 check =1;  
                 
               }
         
            })

        }
      });

   if(check!=1){
     
        let edges_array= Object.keys(data.edges._data).map(function (key) { 
            return data.edges._data[key]; 
       });  
       
       
       edges_array.forEach(edge=>{
           if(edge.to==node && edge.label=="supportedOp")
           { 
              
              element_array.forEach(element=>{
                  if(element.id==edge.from)
                  {  
                       endpoint=element;
                       
                       endpoints.forEach(endpoints=>{
                           if(endpoints.property.label==endpoint.label)
                           {
                               check=1;
                             
                           }
                       }) } }) } })
            }
       
        if(check==1)
        {   
            
            options.nodes.color.hover.background= '#5BDE79';
            options.nodes.color.hover.border= '#5BDE79';
            network.setOptions(options);
        } 
        else{
            options.nodes.color.hover.background= '#FBD20B';
            options.nodes.color.hover.border='#FBD20B' ;
            network.setOptions(options);
        }

        });

       

        network.on("select", function(event){
            
            check=0;
            let selectedRequest;
            let { nodes, edges } =event;
            let element_array= Object.keys(data.nodes._data).map(function (key) { 
            return data.nodes._data[key]; 
       }); 
          
         element_array.forEach(element=>{
                
                if (element.id==nodes[0])
                {
                  endpoint = element;
                }
            });
      
       let i=0;
       endpoints.forEach(endpoints=>{
              if(endpoints.property.label==endpoint.label)
                { 
                  check=1;
                  selectedRequest={Index:i, operation:"GET"}
                  self.selectedNode(selectedRequest);    
                    
                 }
              i+=1;    
           })
           if(check!=1){
        
            let operation = endpoint.label;
            let edges_array= Object.keys(data.edges._data).map(function (key) { 
                return data.edges._data[key]; 
           });  
           
           
           edges_array.forEach(edge=>{
               if(edge.to==nodes[0] && edge.label=="supportedOp")
               { 
                  
                  element_array.forEach(element=>{
                      if(element.id==edge.from)
                      {  
                           endpoint=element;
                           i=0;
                           endpoints.forEach(endpoints=>{
                               if(endpoints.property.label==endpoint.label)
                               {
                                check=1;
                                selectedRequest={Index:i, operation:operation}
                                self.selectedNode(selectedRequest);    
                                
                               }i+=1;
                           }) } }) } })
                }
});
   
    }

   render() {
    const { classes } = this.props;
       return (
            <header className="app-header">
                <div className={classes.graphContainer} id="mynetwork"></div>
            </header>
       )
    }
}

export default withStyles(styles)(HydraGraph);