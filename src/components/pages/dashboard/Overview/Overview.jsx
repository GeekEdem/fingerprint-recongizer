import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import axios from 'axios';
import ToolTip from 'react-portal-tooltip';
import findDOMNode from 'react-dom';

var Blank = React.createClass({

    getInitialState () {
        return {
            users: [],
            isTooltipActive: false,
            image: null
        }
    },

    componentDidMount: function() {
        this.updateUsersList();
    },

    updateUsersList (){
        var _this = this;
        this.serverRequest = axios.get(`/users`)
            .then(res => {
                _this.setState({
                    users: res.data.result
                });
            });
    },

    showTooltip(image) {
        this.setState({
            isTooltipActive: true,
            image: image
        })
    },

    hideTooltip() {
        this.setState({
            isTooltipActive: false
        })
    },

    removeUser(id, name) {
        var _this = this;
        if(confirm('Remove user ' + name)){
            axios.delete('/users/' + id)
                .then(res => {
                    _this.updateUsersList();
                });
        }
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
                            <li key={user._id}>
                                <span onMouseEnter={this.showTooltip.bind(this, user.image.buffer)} onMouseLeave={this.hideTooltip}>{user.username}</span>
                                <div className="pull-right">
                                    <i className="fa fa-pencil-square-o"></i>
                                    <span onClick={this.removeUser.bind(this, user._id, user.username)}>
                                        <i className="fa fa-times pull-right"></i>
                                    </span>
                                </div>
                            </li>
                        )}
                    </ul>
                </Jumbotron>

                <ToolTip active={this.state.isTooltipActive} position="bottom" arrow="center" parent=".jumbotron">
                    <img src={this.state.image} width="320" height="480"/>
                </ToolTip>

            </div>
        );
    }

});

export default Blank;
