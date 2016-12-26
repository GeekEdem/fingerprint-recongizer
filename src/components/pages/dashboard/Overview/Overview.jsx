import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import axios from 'axios';

var Blank = React.createClass({

    getInitialState () {
        return {
            users: []
        }
    },

    componentDidMount: function() {
        var _this = this;
        this.serverRequest = axios.get(`/users`)
            .then(res => {
                _this.setState({
                    users: res.data.result
                });
            });
    },

    render: function() {
        return (
            <div className="overview-page" key="overview">
                <Link to="/dashboard/reports" className="pull-right btn btn-primary btn-outline btn-rounded">Reports</Link>
                <Link to="/dashboard/add" className="pull-right btn btn-primary btn-outline btn-rounded">Add New User</Link>
                <h2>Users <small>registered in system</small></h2>
                <Jumbotron>
                    <ul>
                        {this.state.users.map(user =>
                            <li key={user._id}>{user.username}<i className="fa fa-times pull-right"></i></li>
                        )}
                    </ul>
                </Jumbotron>
            </div>
        );
    }

});

export default Blank;
