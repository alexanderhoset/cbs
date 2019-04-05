import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Heading, UnorderedList, ListItem, Button } from "evergreen-ui";
import { DatePicker } from "./DatePicker";
import { updateRange } from "../actions/analysisactions";
import { formatDate, fromOrDefault, toOrDefault } from "../utils/dateUtils";

import { BASE_URL } from "./Analytics";

class AnalyticsBanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDatePicker: false,
            from: null,
            to: null,
            caseReports: { reportedHealthRisks: [] },
            alerts: {},
            dataCollectors: {
                activeDataCollectors: 0,
                totalNumberOfDataCollectors: 0,
                inactiveDataCollectors: 0
            },
            isLoading: true,
            isError: false
        };
    }

    fetchData() {
        const from = fromOrDefault(this.props.range.from);
        const to = toOrDefault(this.props.range.to);

        const url = `${BASE_URL}${formatDate(from)}/${formatDate(to)}/`;

        fetch(url, { method: "GET" })
            .then(response => response.json())
            .then(json =>
                this.setState({
                    alerts: json.alerts,
                    dataCollectors: json.dataCollectors,
                    caseReports: json.caseReports,
                    isLoading: false,
                    isError: false
                })
            )
            .catch(_ => this.setState({ isLoading: false, isError: true }));
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.range.from !== this.props.range.from ||
            prevProps.range.to !== this.props.range.to
        ) {
            this.fetchData();
        }
    }

    render() {
        return (
            <>
                <div className="analytics--header">
                    <Heading paddingBottom="20px" size={700}>
                        {`Overview from ${formatDate(
                            fromOrDefault(this.props.range.from)
                        )} to ${formatDate(toOrDefault(this.props.range.to))}`}
                    </Heading>
                    <Button
                        iconBefore="calendar"
                        onClick={() =>
                            this.setState({
                                showDatePicker: !this.state.showDatePicker
                            })
                        }
                    >
                        Choose date
                    </Button>
                    {this.state.showDatePicker && (
                        <DatePicker
                            numberOfReports={2}
                            onRangeSelected={range => {
                                console.log(range);
                                this.setState({
                                    ...range,
                                    showDatePicker: false
                                });

                                this.props.updateRange("Day", range);
                            }}
                        />
                    )}
                </div>

                <div className="analytics--headerPanelContainer">
                    <div className="analytics--headerPanel">
                        <i className=" fa fa-heartbeat fa-5x analytics--headerPanelIcon" />

                        <Heading color="#9f0000" size={800} paddingTop={"20px"}>
                            {this.state.caseReports.totalNumberOfReports}{" "}
                            Reports
                        </Heading>
                        <div className="analytics--listContainer">
                            <UnorderedList size={500}>
                                {this.state.caseReports.reportedHealthRisks.map(
                                    (data, index) => (
                                        <ListItem key={index}>
                                            {data.numberOfReports} {data.name}
                                        </ListItem>
                                    )
                                )}
                            </UnorderedList>
                        </div>
                    </div>
                    <div className="analytics--headerPanel">
                        <i className="analytics--headerPanelIcon fa fa-user fa-5x" />

                        <Heading color="#009f00" size={800} paddingTop={"20px"}>
                            {`${
                                this.state.dataCollectors.activeDataCollectors
                            } Active Data Collectors`}
                        </Heading>
                        <div className="analytics--listContainer">
                            <UnorderedList size={500}>
                                <ListItem>{`${
                                    this.state.dataCollectors
                                        .inactiveDataCollectors
                                } Inactive`}</ListItem>
                            </UnorderedList>
                        </div>
                    </div>
                    <div className="analytics--headerPanel">
                        <i className="analytics--headerPanelIcon fa fa-exclamation-triangle fa-5x " />

                        <Heading color="#9f0000" size={800} paddingTop={"20px"}>
                            3 Alerts
                        </Heading>
                        <div className="analytics--listContainer">
                            <UnorderedList size={500}>
                                <ListItem>7 Measels</ListItem>
                                <ListItem>14 Cholera</ListItem>
                                <ListItem>6 Acute Watery Diarrhea</ListItem>
                            </UnorderedList>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        range: state.analytics.range
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateRange }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnalyticsBanner);
