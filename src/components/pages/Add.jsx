import React from 'react';
import FileInput from 'react-file-input';
import { Link } from "react-router";

var InputStyle = {
    opacity: 100
};

var LoginPage = React.createClass({

  getInitialState: function(){
    return {
    };
  },

  handleChange: function(event) {
    event.preventDefault();
    console.log(event);
  },

  render: function(){
      return(
        <div className="login-page ng-scope ui-view"> 
          <div className="row"> 
            <div className="col-md-4 col-lg-4 col-md-offset-4 col-lg-offset-4"> 
              <img src={require("../../common/images/flat-avatar.png")} className="user-avatar" /> 
              <h1>Fingerprint recognition system</h1>
              <form role="form" onSubmit={this.handleChange} className="ng-pristine ng-valid">
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Username" />
                  </div>
                  <FileInput name="fingerprint"
                             accept=".png"
                             placeholder="Fingerprint Image"
                             style={InputStyle} />
                </div> 
                <button type="submit" className="btn btn-white btn-outline btn-lg btn-rounded">Add</button>
              </form>
              <br/>
              <Link to="/dashboard/overview" className="btn btn-white btn-outline btn-lg btn-rounded">Cancel</Link>
            </div> 
          </div> 
        </div>
    );
  }

});

export default LoginPage;