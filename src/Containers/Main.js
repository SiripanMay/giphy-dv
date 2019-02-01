import React, { Component } from 'react';
import { Spin, Modal, Button, Layout, Menu, message } from 'antd';
import ListMovie from '../Components/ListMovie'
import RouteMenu from './RouteMenu'
import { connect } from 'react-redux';

const { Header, Content, Footer } = Layout;
const menus = ['movies', 'favorite', 'profile'];

const mapStateToprops=state=>{
    return{
        isShowDialog:state.isShowDialog,
        itemMovieClick:state.itemMovieDetail
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        onDismisDialog:() =>
        dispatch({
            type:'dismiss_dialog'
            
        }),
        onItemMovieClick:item =>
            dispatch({
                type:'click_item',
                payload:item
            })
    };
};

class Main extends Component {

    state = {
        items: [],
        isShowModal: false,
        itemMovie: null,
        pathName: menus[0],
        favItems: []
    };

    // onItemMovieClick = (item) => {
    //     this.setState({ isShowModal: true, itemMovie: item })
    // }

    onModalClickOk = () => {
        this.props.onDismisDialog();
    }
    onModalClickCancel = () => {
        this.props.onDismisDialog();
    }

    componentDidMount() {
        const jsonStr = localStorage.getItem('list-fav')
        if (jsonStr) {
            const items = jsonStr && JSON.parse(jsonStr)
            this.setState({ favItems: items })
        };

        const { pathname } = this.props.location;
        var pathName = menus[0];
        if (pathname != '/') {
            pathName = pathname.replace('/', '');
            if (!menus.includes(pathName)) pathName = menus[0];
            // include คือ ดูว่าข้างใน(pathName)มีชื่อที่เราต้องการมั้ย
        }
        this.setState({ pathName });
        //TODO: get list movies from API
        fetch('http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=hMms1qM2oT2R0Usd2BywMpguqPdb4wwm')
            .then(response => response.json())
            .then(movies => this.setState({ items: movies.data }))

    }

    onMenuClick = e => {
        var path = '/';
        if (e.key != 'movies') {
            path = `/${e.key}`;
        }
        {
            this.props.history.replace(path); // หรือใช้ push ก็ได้ ตรง replace
        };
    }

    onClickFavorite = () => {
        const itemClick = this.props.itemMovieClick
        const items = this.state.favItems

        const result = items.find(item => {
            return item.title === itemClick.title
        })

        if (result) {
            // TODO: show error
            message.error('This item added favorite', 1.5)
        } else {
            items.push(itemClick)
            // TODO: save item to localstorage
            localStorage.setItem('list-fav', JSON.stringify(items))
            message.success('Saved your favorite movie', 1.5);
            this.onModalClickCancel()
        }
    }

    // componentDidMount() {

    //     const jsonStr = localStorage.getItem('list-fav')
        
    //     if(jsonStr){
    //     const items = jsonStr && JSON.parse(jsonStr)
    //     console.log(items);

    //     this.setState({ favItems: items })
    //     }
        

    //     const { pathname } = this.props.location;
    //     var pathName = menus[0];
    //     if (pathname != '/') {
    //         pathName = pathname.replace('/', '');//replace = แทนที่
    //         if (!menus.includes(pathName)) pathName = menus[0];
    //     }
    //     this.setState({ pathName })
    //     fetch('https://workshopup.herokuapp.com/movie')
    //         .then(response => response.json())
    //         .then(movies => this.setState({ items: movies.results }))
    // }

    // onMenuClick = e => {
    //     var path = '/';
    //     console.log(e.key)
    //     if (e.key != 'movies') {
    //         path = `/${e.key}`;
    //     }

    //     this.props.history.replace(path);
    // }

    // onClickFavorite = () => {

    //     const itemClick = this.state.itemMovie
    //     const items = this.state.favItems
    //     const result = items.find(item => {
    //         return item.title == itemClick.title
    //     })

    //     if (result) {
    //         message.error('This item added favorite')
    //     } else {
    //         items.push(itemClick)
    //         localStorage.setItem('list-fav', JSON.stringify(items))
    //         message.success('Saved your favorite movie', 1);
    //         this.onModalClickCancel()
    //     }

    // }

    render() {
        const item = this.props.itemMovieClick
        console.log(item);
        
        return (
            <div className="Main">
                {this.state.items.length > 0 ? (
                    <div style={{ height: `100vh` }}>
                        {' '}

                        <Layout className="layout" style={{ background: `white` }}>
                            <Header
                                style={{
                                    padding: '0px',
                                    position: 'fixed',
                                    zIndex: 1,
                                    width: '100%'
                                }}
                            >

                                <Menu
                                    theme="light"
                                    mode="horizontal"
                                    defaultSelectedKeys={[this.state.pathName]}
                                    style={{ lineHeight: '64px' }}
                                    onClick={e => {
                                        this.onMenuClick(e);
                                    }}
                                >
                                    <Menu.Item key={menus[0]}>Home</Menu.Item>
                                    <Menu.Item key={menus[1]}>Favorite</Menu.Item>
                                    <Menu.Item key={menus[2]}>Profile</Menu.Item>
                                </Menu>
                            </Header>
                            <Content
                                style={{
                                    padding: '16px',
                                    marginTop: 64,
                                    minHeight: '600px',
                                    justifyContent: 'center',//แนวตั้ง
                                    alignItems: 'center',//แนวนอน+ตรงกลาง
                                    display: 'flex' //เป็นการตัดให้เท่ากับข้อความ
                                }}
                            >
                                <RouteMenu
                                    items={this.state.items}
                                    // onItemMovieClick={this.onItemMovieClick}
                                />
                            </Content>
                            <Footer style={{ textAlign: 'center', background: `white` }}>
                                Movie Application Workshop @ CAMT
                            </Footer>
                        </Layout>
                    </div>

                ) : (
                        <Spin size="large" />
                    )}
                {item != null ? (



                    <Modal
                        width="40%"
                        style={{ maxHeight: '70%' }}
                        title={item.title}
                        visible={this.props.isShowDialog}
                        onCancel={this.onModalClickCancel}

                        footer={[

                            <Button
                                key="submit"
                                type="primary"
                                icon="heart"
                                size="large"
                                shape="circle"
                                onClick={this.onClickFavorite}
                            />,

                            <Button
                                key="submit"
                                type="primary"
                                icon="shopping-cart"
                                size="large"
                                shape="circle"
                                onClick={this.onClickShopping}
                            />

                        ]}
                    >
                        {item.images!=null?(
                            <img src={item.images.fixed_width.url} style={{ width: '100%' }} />
                        ):(
                            <div></div>
                        )}
                        {/*  */}
                        <br />
                        <br />
                        <p>{item._score}</p>

                    </Modal>
                ) : (
                        <div />
                    )}
            </div>
        );
    }
}

export default connect(
    mapStateToprops,
    mapDispatchToProps
) (Main)