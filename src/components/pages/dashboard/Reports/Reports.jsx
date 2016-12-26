import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import axios from 'axios';

var Buttons = React.createClass({

    getInitialState () {
        return {
            histories: []
        }
    },

    componentDidMount: function() {
        var _this = this;
        this.serverRequest = axios.get(`/history`)
            .then(res => {
                _this.setState({
                    histories: res.data.result
                });
            });
    },

    render: function() {
        return (
            <div key="reports" className="reports-page">
                <div className="ng-scope">
                    <Link to="/dashboard/overview" className="pull-right btn btn-primary btn-outline btn-rounded">Back to users</Link>
                    <h2>Reports</h2>

                    <i className="glyphicon glyphicon-dashboard bg-fade"></i>

                    <Jumbotron>
                        <ul>
                            {this.state.histories.map(history =>
                                <li key={history._id}>
                                    <ul>
                                        {history.match.map( (match, index) =>
                                            <li key={history._id + index}>{match.username.username} -> {match.match}</li>
                                        )}
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </Jumbotron>
                </div>
            </div>
        );
    }

});

export default Buttons;