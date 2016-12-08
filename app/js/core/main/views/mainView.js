/**
 * Meat and potatoes of this app.
 **
 * @todo - Add in all animal crossing card amiibos
 *
 * @todo - Write deployment script.
 *
 * @todo - Create minimalistic logo with corresponding favicon
 *
 * @todo - Image generation may not be working in safari
 *
 * @todo - Make sure the stats listing goes through the collection sorting algors
 *
 * @todo - Consider adding "infinity scrolling" functionality so all collection images don't load at once.
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'jquery.sticky',
  'text!core/main/templates/amiibo-group.tpl.html',
  'text!core/main/templates/amiibo-grid-item.tpl.html',
  'text!core/main/templates/message-browser-compat.tpl.html',
  'text!core/main/templates/menu-item-settings.tpl.html',
  'text!core/main/templates/menu-item-settings-subitem.tpl.html',
  'text!core/main/templates/menu-sort.tpl.html',
  'text!core/main/templates/menu-group.tpl.html',
  'text!core/main/templates/menu-group-group.tpl.html',
  'text!core/main/templates/menu-share.tpl.html',
  'text!core/main/templates/menu-stats.tpl.html',
  'text!core/main/templates/menu-stats-group.tpl.html',
  'text!core/main/templates/menu-restart.tpl.html'
], function(
  $,
  _,
  Backbone,
  Sticky,
  amiiboGroupTpl,
  amiiboGridItemTpl,
  messageBrowserCompatTpl,
  menuItemSettingsTpl,
  menuItemSettingsSubitemTpl,
  menuSortTpl,
  menuGroupTpl,
  menuGroupGroupTpl,
  menuShareTpl,
  menuStatsTpl,
  menuStatsGroupTpl,
  menuRestartTpl
) {
  var Main = Backbone.View.extend({
    el: $('body'),

    templates: {
      amiiboGroup: _.template(amiiboGroupTpl),
      amiiboGridItem: _.template(amiiboGridItemTpl),
      messageBrowserCompat: _.template(messageBrowserCompatTpl),
      menuItemSettings: _.template(menuItemSettingsTpl),
      menuItemSettingsSubitem: _.template(menuItemSettingsSubitemTpl),
      menuSort: _.template(menuSortTpl),
      menuGroup: _.template(menuGroupTpl),
      menuGroupGroup: _.template(menuGroupGroupTpl),
      menuShare: _.template(menuShareTpl),
      menuStats: _.template(menuStatsTpl),
      menuStatsGroup: _.template(menuStatsGroupTpl),
      menuRestart: _.template(menuRestartTpl)
    },

    events: {

      // @todo - Possibly refactor stats menu into own view
      'click .control-stats': 'toggleStatsMenu',

      // @todo - Possibly refactor group menu into own view
      'click .control-group': 'toggleGroupMenu',
      'click .menu-group .checkbox-icon': 'toggleGroupOnOff',
      'click .menu-group .group-title': 'loadSelectedGroup',

      // @todo - Possibly refactor sort menu into own view
      'click .control-sort': 'toggleSortMenu',
      'click .control[data-control-id="sort-alpha-asc"]': 'handleSort',
      'click .control[data-control-id="sort-alpha-desc"]': 'handleSort',
      'click .control[data-control-id="sort-total-asc"]': 'handleSort',
      'click .control[data-control-id="sort-total-desc"]': 'handleSort',

      // @todo - Refactor share menu into own view
      'click .control-share': 'toggleShareMenu',
      'click .menu-share .control-generate-share-image .button': 'generateShareImage',
      'click .menu-share .control-generate-json-config .button': 'generateJSONConfig',
      'click .menu-share .control-upload-json-config .button': 'uploadJSONConfig',

      // @todo - Possibly refactor restart menu into own view
      'click .control-restart': 'toggleRestartMenu',
      'click .menu-restart .restart-continue': 'handleCollectionRestart',

      // @todo - Possibly refactor group controls into own view
      'click .amiibo-grid h2 .group-select-toggle': 'toggleSelectedGroup',
      'click .amiibo-grid h2 .group-expando-toggle': 'toggleExpandGroup',

      // @todo - Possibly refactor item controls/menu into own view
      'click .grid-item': 'toggleSelectedItem',
      'click .grid-item .grid-item-title .button': 'toggleItemSettingsMenu',
      'click .menu-item-settings .controls-item-add': 'itemSettingsAddSubitem',
      'click .menu-item-settings .controls-item-up': 'itemSettingsUpSubitem',
      'click .menu-item-settings .controls-item-favorite': 'itemSettingsFavoriteSubitem',
      'click .menu-item-settings .controls-item-remove': 'itemSettingsRemoveSubitem',
      'click .menu-item-settings .controls-item-favorite-selected': 'itemSettingsFavoriteSubitem',
      'change .menu-item-settings .controls-item-status select': 'itemSettingsSubitemStatusUpdate',
      'change .menu-item-settings .controls-item-condition select': 'itemSettingsSubitemConditionUpdate',
      'click .menu-item-settings .controls-item-note .button': 'itemSettingsSubitemNoteToggle',
      'click .menu-item-settings .controls-item-note .notepad': 'itemSettingsSubitemNoteToggle'
    },

    // Stores references to loaded menus
    menus: {},

    // Collection initialization object
    collection: {

      // Animal crossing
      animalcrossing: {
        title: "Animal Crossing",
        collection: {
          blathers: {
            title: "Blathers"
          },
          celeste: {
            title: "Celeste"
          },
          cyrus: {
            title: "Cyrus"
          },
          digby: {
            title: "Digby"
          },
          isabellesummeroutfit: {
            title: "Isabelle (summer outfit)"
          },
          isabellewinteroutfit: {
            title: "Isabelle (winter outfit)"
          },
          kappn: {
            title: "Kappn"
          },
          kicks: {
            title: "Kicks"
          },
          kk: {
            title: "K.K."
          },
          lottie: {
            title: "Lottie"
          },
          mabel: {
            title: "Mabel"
          },
          reese: {
            title: "Reese"
          },
          reseti: {
            title: "Reseti"
          },
          rover: {
            title: "Rover"
          },
          timmytommy: {
            title: "Timmy & Tommy"
          },
          tomnook: {
            title: "Tom Nook"
          }
        }
      },

      // Amiibo bundles
      bundles: {
        title: "Amiibo Bundles",
        collection: {
          animalcrossing: {
            title: "Animal Crossing: Amiibo Festival"
          },
          captaintoad: {
            title: "Captain Toad: Treasure Tracker"
          },
          chibirobo: {
            title: "Chibi-Robo! Zip Lash"
          },
          goldmegaman: {
            title: "Mega Man: Legacy Collection"
          },
          mariopartybowser: {
            title: "Mario Party 10 (Bowser)"
          },
          mariopartymario: {
            title: "Mario Party 10 (Mario)"
          },
          mariopartypeach: {
            title: "Mario Party 10 (Peach)"
          },
          twilightprincess: {
            title: "Zelda: Twilight Princess HD"
          },
          yoshiswollyworldblue: {
            title: "Yoshi's Wolly World (Blue)"
          },
          yoshiswollyworldgreen: {
            title: "Yoshi's Wolly World (Green)"
          },
          yoshiswollyworldpink: {
            title: "Yoshi's Wolly World (Pink)"
          }
        }
      },

      // Chibi robo
      chibi: {
        title: "Chibi Robo",
        collection: {
          robo: {
            title: "Chibi Robo"
          }
        }
      },

      // Kirby
      kirby: {
        title: "Kirby",
        collection: {
          kingdedede: {
            title: "King Dedede"
          },
          kirby: {
            title: "Kirby"
          },
          metaknight: {
            title: "Meta Knight"
          },
          waddledee: {
            title: "Waddle Dee"
          }
        }
      },

      // Legend of zelda
      loz: {
        title: "Legend of Zelda",
        collection: {
          anniversarylink: {
            title: "Link - 30th Anniversary"
          },
          guardian: {
            title: "Guardian"
          },
          linkarcher: {
            title: "Link - Archer"
          },
          linkrider: {
            title: "Link - Rider"
          },
          ocarinalink: {
            title: "Link - Ocarina of Time"
          },
          toonlink: {
            title: "Toon Link - The Wind Waker"
          },
          wolflink: {
            title: "Wolf Link"
          },
          zelda: {
            title: "Zelda - The Wind Waker"
          }
        }
      },

      // Mega man
      megaman: {
        title: "Mega Man - Legacy Collection",
        collection: {
          gold: {
            title: "Mega Man - Gold Edition"
          }
        }
      },

      // Monster hunter
      monsterhunter: {
        title: "Monster Hunter",
        collection: {
          beriorosuaiola: {
            title: "Beriorosu & Avuria"
          },
          kurupekkodan: {
            title: "Kurupekko & Dan Seniors"
          },
          navirou: {
            title: "Nabiru"
          },
          rioreiacheval: {
            title: "Rioreia & Cheval"
          },
          rioreusuriderboy: {
            title: "Sekigan of Rioreusu & Rider Boy"
          },
          rioreusuridergirl: {
            title: "Sekigan of Rioreusu & Rider Boy"
          }
        }
      },

      // Shovel knight
      shovelknight: {
        title: "Shovel Knight",
        collection: {
          shovelknight: {
            title: "Shovel Knight"
          }
        }
      },

      // Skylanders
      skylanders: {
        title: "Skylanders Superchargers",
        collection: {
          hammerslambowser: {
            title: "Hammer Slam Bowser"
          },
          darkhammerslambowser: {
            title: "Dark Hammer Slam Bowser"
          },
          superchargeddonkeykong: {
            title: "Super Charged Donkey Kong"
          },
          darksuperchargeddonkeykong: {
            title: "Dark Super Charged Donkey Kong"
          }
        }
      },

      // Splatoons
      splatoons: {
        title: "Splatoons",
        collection: {
          callie: {
            title: "Callie"
          },
          inklingboy1: {
            title: "Inkling Boy"
          },
          inklingboy2: {
            title: "Inkling Boy"
          },
          inklinggirl1: {
            title: "Inkling Girl"
          },
          inklinggirl2: {
            title: "Inkling Girl"
          },
          inklingsquidgreen: {
            title: "Inkling Squid"
          },
          inklingsquidorange: {
            title: "Inkling Squid"
          },
          marie: {
            title: "Marie"
          }
        }
      },

      // Super smash brothers
      ssb: {
        title: "Super Smash Brothers",
        collection: {
          bowser: {
            title: "Bowser"
          },
          bowserjr: {
            title: "Bowser Jr."
          },
          captainfalcon: {
            title: "Captain Falcon"
          },
          charizard: {
            title: "Charizard"
          },
          darkpit: {
            title: "Dark Pit"
          },
          diddykong: {
            title: "Diddy Kong"
          },
          donkeykong: {
            title: "Donkey Kong"
          },
          drmario: {
            title: "Dr. Mario"
          },
          duckhunt: {
            title: "Duck Hunt Dog"
          },
          falco: {
            title: "Falco"
          },
          famicomrob: {
            title: "Famicom R.O.B."
          },
          fox: {
            title: "Fox"
          },
          gamewatch: {
            title: "Mr. Game & Watch"
          },
          ganondorf: {
            title: "Ganondorf"
          },
          greninja: {
            title: "Greninja"
          },
          ike: {
            title: "Ike"
          },
          jigglypuff: {
            title: "Jiggly Puff"
          },
          kingdedede: {
            title: "King Dedede"
          },
          kirby: {
            title: "Kirby"
          },
          link: {
            title: "Link"
          },
          littlemac: {
            title: "Little Mac"
          },
          lucario: {
            title: "Lucario"
          },
          lucas: {
            title: "Lucas"
          },
          lucina: {
            title: "Lucina"
          },
          luigi: {
            title: "Luigi"
          },
          mario: {
            title: "Mario"
          },
          marth: {
            title: "Marth"
          },
          megaman: {
            title: "Mega Man"
          },
          metaknight: {
            title: "Meta Knight"
          },
          mewtwo: {
            title: "Mewtwo"
          },
          miibrawler: {
            title: "Mii Brawler"
          },
          miigunner: {
            title: "Mii Gunner"
          },
          miiswordfighter: {
            title: "Mii Sword Fighter"
          },
          ness: {
            title: "Ness"
          },
          olimar: {
            title: "Olimar"
          },
          pacman: {
            title: "Pac Man"
          },
          palutena: {
            title: "Palutena"
          },
          peach: {
            title: "Peach"
          },
          pikachu: {
            title: "Pikachu"
          },
          pit: {
            title: "Pit"
          },
          rob: {
            title: "R.O.B."
          },
          robin: {
            title: "Robin"
          },
          rosalina: {
            title: "Rosalina"
          },
          roy: {
            title: "Roy"
          },
          ryu: {
            title: "Ryu"
          },
          samus: {
            title: "Samus"
          },
          sheik: {
            title: "Sheik"
          },
          shulk: {
            title: "Shulk"
          },
          sonic: {
            title: "Sonic"
          },
          toonlink: {
            title: "Toon Link"
          },
          villager: {
            title: "Villager"
          },
          wario: {
            title: "Wario"
          },
          wiifittrainer: {
            title: "Wii Fit Trainer"
          },
          yoshi: {
            title: "Yoshi"
          },
          zelda: {
            title: "Zelda"
          },
          zerosuitsamus: {
            title: "Zero Suit Samus"
          }
        }
      },

      // Super Mario
      supermario: {
        title: "Super Mario",
        collection: {
          boo: {
            title: "Boo"
          },
          bowser: {
            title: "Bowser"
          },
          daisy: {
            title: "Daisy"
          },
          diddykong: {
            title: "Diddy Kong"
          },
          donkeykong: {
            title: "Donkey Kong"
          },
          goldmario: {
            title: "Gold Mario"
          },
          luigi: {
            title: "Luigi"
          },
          mario: {
            title: "Mario"
          },
          peach: {
            title: "Peach"
          },
          rosalina: {
            title: "Rosalina"
          },
          silvermario: {
            title: "Silver Mario"
          },
          toad: {
            title: "Toad"
          },
          waluigi: {
            title: "Waluigi"
          },
          wario: {
            title: "Wario"
          },
          yoshi: {
            title: "Yoshi"
          }
        }
      },

      // Super Mario Bros. 30th
      supermario30th: {
        title: "Super Mario Bros. 30th",
        collection: {
          classiccolor: {
            title: "30th Anniversary Mario - Classic Color"
          },
          moderncolor: {
            title: "30th Anniversary Mario - Modern Color"
          }
        }
      },

      // Yoshi
      yoshi: {
        title: "Yoshi",
        collection: {
          blueyarnyoshi: {
            title: "Blue Yarn Yoshi"
          },
          greenyarnyoshi: {
            title: "Green Yarn Yoshi"
          },
          megayarnyoshi: {
            title: "Mega Yarn Yoshi"
          },
          pinkyarnyoshi: {
            title: "Pink Yarn Yoshi"
          },
          poochy: {
            title: "Poochy"
          }
        }
      }
    },

    // Copy of collection initialization object as a sortable array
    collection_sorted: null,

    // Generalized app settings object
    app_settings: {
      name: 'Amiibo Collector'
    },

    // Collection settings initialization object
    collection_settings: {
      sort_by: 'alpha-asc'
    },

    // Local Storage configuration
    storage_settings: {
      id: "amiibo-collection",
      dont_use_local: false,
      is_local: window.localStorage ? true : false,
      loaded: false,
      asset_path: 'app/assets/images/collection/'
    },

    // Placeholder for collection configuration file
    collection_configuration_file: null,

    // Placeholder for collection stats file
    collection_stats_file: null,


    /**
     * Initialize the application.
     */
    initialize: function() {

      // Bind methods
      _.bindAll(this,
        'loadCollection',
        'storageDiffUpdate',

        // @todo - Possibly refactor stats menu into own view
        'toggleStatsMenu',

        // @todo - Possibly refactor group menu into own view
        'toggleGroupMenu',
        'toggleGroupOnOff',
        'loadSelectedGroup',

        // @todo - Possibly refactor sort menu into own view
        'toggleSortMenu',
        'handleSort',
        'sortAlphaAsc',
        'sortAlphaDesc',
        'sortTotalAsc',
        'sortTotalDesc',

        // @todo - Refactor share menu into own view
        'toggleShareMenu',
        'generateShareImage',
        'generateJSONConfig',
        'uploadJSONConfig',

        // @todo - Possibly refactor restart menu into own view
        'toggleRestartMenu',
        'handleCollectionRestart',

        // @todo - Possibly refactor group controls into own view
        'toggleSelectedGroup',
        'toggleExpandGroup',

        // @todo - Possibly refactor collection items into own view
        'toggleSelectedItem',
        'toggleItemSettingsMenu',
        'itemSettingsAddSubitem',
        'itemSettingsUpSubitem',
        'itemSettingsFavoriteSubitem',
        'itemSettingsRemoveSubitem',
        'itemSettingsSubitemStatusUpdate',
        'itemSettingsSubitemConditionUpdate',
        'itemSettingsSubitemNoteToggle'
      );
      
      // Initialize sticky navigation
      $('.controls').sticky({
        start: 'top',
        end: 'top',
        smooth: true,
        stack: true,
        onStick: function(elm) {
          $(elm).addClass('stuck');
        },
        onUnstick: function(elm) {
          $(elm).removeClass('stuck');
        }
      });

      // Capture the scroll position when a modal opens so it can be restored when modals are closed
      $(document).on('opening', '.remodal', function () {
        $(this).data('last-scroll-pos', $(window).scrollTop());
      });
      $(document).on('closed', '.remodal', function () {
        $(window).scrollTop($(this).data('last-scroll-pos'));
      });

      // Trigger not supported message if user browser doesn't support localStorage
      if (!this.storage_settings.is_local) {
        var modal = $(this.templates.messageBrowserCompat({
          app_name: this.app_settings.name
        })).remodal();
        this.$el.append(modal);
        modal.open();
      }

      // Load the collection
      this.loadCollection();
    },


    /**
     * Load and built the collection.
     */
    loadCollection: function() {
      var
        self        = this,
        path        = this.storage_settings.asset_path,
        grid        = $('.grid-container');

      // Make sure the grid container is cleared out
      grid.empty();

      // Test to see if we should load from local storage
      if (this.storage_settings.is_local && !this.storage_settings.dont_use_local && !this.loaded) {

        // Indicate local storage has been loaded
        this.loaded = true;

        // Proceed to load collection object when it exists
        if (window.localStorage.getItem(this.storage_settings.id)) {
          this.storageDiffUpdate();
          this.collection = JSON.parse(window.localStorage.getItem(this.storage_settings.id));
        }

        // Load the collection settings object when it exists otherwise set it
        if (window.localStorage.getItem(this.storage_settings.id + '_settings')) {
          this.collection_settings = JSON.parse(window.localStorage.getItem(this.storage_settings.id + '_settings'));
        } else {
          window.localStorage.setItem(this.storage_settings.id + '_settings', JSON.stringify(this.collection_settings));
        }
      }

      // Convert collection to sortable array while populating meta properties
      this.collection_sorted = _.map(JSON.parse(JSON.stringify(this.collection)), function(group, group_id) {
        group.id = group_id;
        group.size = _.size(group.collection);
        group.collection = _.map(group.collection, function(item, item_id) {
          item.id = item_id;
          return item;
        });
        return group;
      });

      // Sort groups based on collection settings
      switch (this.collection_settings.sort_by) {
        case 'alpha-asc' :
          this.collection_sorted = this.sortAlphaAsc(this.collection_sorted);
          break;
        case 'alpha-desc' :
          this.collection_sorted = this.sortAlphaDesc(this.collection_sorted);
          break;
        case 'total-asc' :
          this.collection_sorted = this.sortTotalAsc(this.collection_sorted);
          break;
        case 'total-desc' :
          this.collection_sorted = this.sortTotalDesc(this.collection_sorted);
          break;
      }

      // Iterate over collection
      _.each(this.collection_sorted, function(group) {
        var
          group_id          = group.id,
          grid_group        = self.templates.amiiboGroup({
            group_name: group_id,
            group_title: group.title,
            group_collected: _.filter(group.collection, 'collected').length,
            group_total: _.size(group.collection)
          }),
          group_elm         = null;

        // Add group only if it hasn't been set to not load
        if (!group.unchecked) {

          // Add new group container
          grid.append(grid_group);
          group_elm = $('.amiibo-grid[data-group-name="' + group_id + '"]');

          // Create new group container
          _.each(group.collection, function(item) {
            var
              item_id             = item.id,
              amiibo_path         = path + group_id + '-' + item_id + '.png';

            // Create new grid object
            grid.find('.' + group_id + ' .group').append(self.templates.amiiboGridItem({
              amiibo_name: item_id,
              amiibo_path: amiibo_path,
              amiibo_title: item.title || '',
              amiibo_class: ((item.collected) ? 'collected' : '')
            }));
          });

          // Add appropriate class on group to indicate whether or not a group has been collected
          if (group.size == _.filter(group.collection, 'collected').length) {
            group_elm
              .data('group-collected', 'yes')
              .addClass('group-collected');
          } else {
            group_elm
              .data('group-collected', 'no')
              .removeClass('group-collected');
          }

          // Toggle show/hide the group based on its user setting
          if (group.closed) {
            group_elm.addClass('group-closed');
          } else {
            group_elm.removeClass('group-closed');
          }
        }
      });
    },


    /**
     * Tests for differences in the collection initialization object and the local storage object, making changes where
     * applicable to the local storage object.
     */
    storageDiffUpdate: function() {
      var
        initObj         = this.collection,
        localObj        = JSON.parse(window.localStorage.getItem(this.storage_settings.id));

      // Add new groups to local object
      _.each(_.keys(initObj), function(v) {

        // Add new groups
        if (!(v in localObj)) {
          localObj[v] = initObj[v];
        }

        // Add collection item to the group
        _.each(initObj[v].collection, function(item, key) {
          if (!(key in localObj[v].collection)) {
            localObj[v].collection[key] = initObj[v].collection[key];
          }
        });
      });

      // Remove groups to local object
      _.each(_.keys(localObj), function(l) {

        // Remove old collection item from group
        _.each(localObj[l].collection, function(item, key) {
          if (!(key in initObj[l].collection)) {
            delete localObj[l].collection[key];
          }
        });

        // Remove old group
        if (!(l in initObj)) {
          delete localObj[l];
        }
      });

      // Update simple properties like titles that may have changed
      _.each(initObj, function(vObj, key) {
        if (vObj.title != localObj[key].title) {
          localObj[key].title = vObj.title;
        }

        // Iterate over the collection object checking simple things like titles
        _.each(initObj[key].collection, function(cObj, id) {
          if (localObj[key].collection[id].title != cObj.title) {
            localObj[key].collection[id].title = initObj[key].collection[id].title;
          }
        });
      });

      // Update the local storage object
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(localObj));
    },





    //
    // !!!!!!!
    // @todo - Possibly refactor the Stats Menu into its own view
    // !!!!!!!
    //

    /**
     * Toggle and populate the stats menu.
     */
    toggleStatsMenu: function() {
      var
        self                = this,
        stats_container     = null,
        stats               = {
          total: 0,
          owned: 0
        };

      // Add the modal menu
      if (!this.menus.stats) {
        this.menus.stats = $(this.templates.menuStats()).remodal();
        this.$el.append(this.menus.stats);
      }

      // Reference the stats container
      stats_container = $('.stats-container');

      // Clear previous stats
      stats_container.empty();

      // Populate the statistics object
      _.each(this.collection, function(group, group_name) {
        stats[group_name] = {
          total: _.size(group.collection),
          owned: _.size(_.filter(group.collection, function(item) {
            return item.collected;
          }))
        };

        // Update overall totals
        stats.total += stats[group_name].total;
        stats.owned += stats[group_name].owned;

        // Determine percentage
        var group_perc = ((stats[group_name].owned / stats[group_name].total) * 100).toFixed(2);

        // Add a stat group to the container
        stats_container.append(self.templates.menuStatsGroup({
          group_id: group_name,
          group_title: group.title,
          group_total: stats[group_name].total,
          group_owned: stats[group_name].owned,
          group_perc: group_perc
        }));

        // Add the completed class if a group is completed
        if (group_perc >= 100) {
          $('[data-group-id="' + group_name + '"]').addClass('complete');
        }
      });

      // Determine overall percentage
      var overall_perc = ((stats.owned / stats.total) * 100).toFixed(2);

      // Add the overall stat
      stats_container.prepend(self.templates.menuStatsGroup({
        group_id: 'amiibo-total',
        group_title: "Total",
        group_total: stats.total,
        group_owned: stats.owned,
        group_perc: overall_perc
      }));

      // Add the completed class if all groups are completed
      if (overall_perc >= 100) {
        $('[data-group-id="amiibo-total"]').addClass('complete');
      }

      // Toggle menu open/closed
      this.menus.stats.open();
    },





    //
    // !!!!!!!
    // @todo - Possibly refactor the Group Menu into its own view
    // !!!!!!!
    //

    /**
     * Toggle and load the group menu.
     */
    toggleGroupMenu: function() {
      var
        self                = this,
        groups_container    = null;

      // Add the modal menu
      if (!this.menus.group) {
        this.menus.group = $(this.templates.menuGroup()).remodal();
        this.$el.append(this.menus.group);
      }

      // Reference the group container
      groups_container = $('.groups-container');

      // Re-add the group controls each time the menu is opened
      groups_container.children().remove();
      _.each(this.collection_sorted, function(group) {

        // Add the group controls
        groups_container.append(self.templates.menuGroupGroup({
          group_name: group.id,
          group_title: group.title,
          checked: group.unchecked ? '' : 'checked'
        }));
      });

      // Open the menu
      this.menus.group.open();
    },


    /**
     * Toggles a collection group on or off (whether or not it is to be displayed in the collection listing).
     */
    toggleGroupOnOff: function(e) {
      var
        target        = $(e.currentTarget),
        group         = target.closest('.group-group'),
        group_id      = target.data('id');

      // Toggle checked class on group
      group.toggleClass('checked');

      // Update whether the group is selected
      this.collection[group_id].unchecked = target.hasClass('unchecked') ? false : true;

      // Save to local storage
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));

      // Reload the collection
      this.loadCollection();
    },


    /**
     * Handles the loading of only a single group.
     */
    loadSelectedGroup: function(e) {
      var
        self          = this,
        target        = $(e.currentTarget),
        target_id     = target.data('id');

      // Iterate through collection groups, setting only target to be displayed
      _.each(this.collection, function(group, group_id) {
        var
          input       = $('.checkbox-icon[data-id="' + group_id + '"]');
        if (target_id != group_id) {
          self.collection[group_id].unchecked = true;
          input.closest('.group-group').removeClass('checked');
          self.loadCollection();
        } else {
          self.collection[group_id].unchecked = false;
          input.closest('.group-group').addClass('checked');
        }
      });

      // Close the menu
      this.menus.group.close();
    },





    //
    // !!!!!!!
    // @todo - Possibly refactor the Sort Menu into it's own view. That said the sort methods are fairly well
    // integrated into the loading of the collection so perhaps not.
    // !!!!!!!
    //

    /**
     * Toggle and load the sort menu
     */
    toggleSortMenu: function() {
      if (!this.menus.sort) {
        this.menus.sort = $(this.templates.menuSort()).remodal();
        this.$el.append(this.menus.sort);
      }

      // Toggle menu open/closed
      if (this.menus.sort) this.menus.sort.open();
    },


    /**
     * Event handler attached to sort controls reloads collection listings.
     */
    handleSort: function(e) {
      var
        target        = $(e.currentTarget),
        sort_by       = target.attr('data-control-id').replace('sort-', '');

      // Update collection settings object
      this.collection_settings.sort_by = sort_by;
      window.localStorage.setItem(this.storage_settings.id + '_settings', JSON.stringify(this.collection_settings));

      // Reload the collection & close the menu
      this.loadCollection();
      this.menus.sort.close();
    },


    /**
     * Sort groups alpha ascending.
     */
    sortAlphaAsc: function( collection ) {
      return  _.map(_.sortBy(collection, 'title'), function(group) {
        group.collection = _.sortBy(group.collection, 'title');
        return group;
      });
    },


    /**
     * Sort groups alpha descending.
     */
    sortAlphaDesc: function( collection ) {
      return  _.map(_.sortBy(collection, 'title').reverse(), function(group) {
        group.collection = _.sortBy(group.collection, 'title').reverse();
        return group;
      });
    },


    /**
     * Sort by total number ascending.
     */
    sortTotalAsc: function( collection ) {
      return  _.sortBy(collection, 'size');
    },


    /**
     * Sort by total number descending.
     */
    sortTotalDesc: function( collection ) {
      return  _.sortBy(collection, 'size').reverse();
    },





    //
    // !!!!!!!
    // @todo - Refactor Share menu into own view
    // !!!!!!!
    //

    /**
     * Toggle and load the share menu
     * Load the share menu with a dynamically generated share URL and collection image.
     */
    toggleShareMenu: function() {

      // Add the modal menu
      if (!this.menus.share) {
        this.menus.share = $(this.templates.menuShare()).remodal();
        this.$el.append(this.menus.share);
      }

      // Reset configuration generation
      var generate_json_config_container = $('.control-generate-json-config');
      generate_json_config_container.find('.message').show();
      generate_json_config_container.find('.download').hide();

      // Reset share image messages and elements
      var generate_share_image_container = $('.control-generate-share-image');
      generate_share_image_container.find('.message').show();
      generate_share_image_container.find('.download').hide();
      generate_share_image_container.find('.none').hide();
      generate_share_image_container.find('img').remove();
      generate_share_image_container.find('.share-image').remove();

      // Toggle menu open
      this.menus.share.open();
    },


    /**
     * Generates an image of a user's collection.
     */
    generateShareImage: function() {
      var
        container       = $('.control-generate-share-image'),
        canvas          = $('<canvas class="share-image" width="400" height="600"></canvas>'),
        c_w             = 0,                // Canvas width
        c_h             = 0,                // Canvas height
        ctx             = null,             // Canvas context
        total_rows      = 0,                // Total number of rows
        max_per_row     = 4,                // Maximum number of images to draw in a row
        max_w           = 0,                // Maximum width to draw an image
        max_h           = 0,                // Maximum height to draw an image
        items_drawn     = 0,                // Number of images that have been drawn
        rows_drawn      = 0,                // Number of rows that have been drawn
        is_collected    = false,            // Flag set if any group has a collected item
        collection_img  = null;             // Placeholder for the generated image

      // Remove any previous canvas/image elements and a new canvas
      container.find('.share-image').remove();
      container.find('.true-share-image').remove();
      container.find('.info').append(canvas);

      // Determine the dimensions of the canvas based on the number of items to be drawn
      _.each(this.collection, function(group, group_id) {
        var
          group_elm                   = $('.amiibo-grid[data-group-name="' + group_id + '"]'),
          total_to_draw_in_group      = 0,
          collected                   = _.filter(group.collection, function(item) {
            return item.collected;
          }).length;

        // Update collected flag
        if (collected) is_collected = true;

        // Proceed if one or more in group is collected
        if (is_collected) {

          // Iterate over collection items
          _.each(group.collection, function(amiibo, amiibo_name) {
            if (amiibo.collected) {
              var
                img         = group_elm.find('.grid-item[data-amiibo-name="' + amiibo_name + '"] img')[0],
                img_clone   = $(img).clone(),
                img_w       = 0,
                img_h       = 0;

              // Temporarily place the image in the DOM so we can measure the actual dimensions of
              // potentially hidden image elements.
              $('body').append(img_clone.css({position: 'absolute', display: 'block', left: '-10000px'}));
              img_w = img_clone.width();
              img_h = img_clone.height();
              img_clone.remove();

              // Update current maximum width if it's greater
              if (img_w > max_w) max_w = img_w;

              // Update current maximum height if it's greater
              if (img_h > max_h) max_h = img_h;

              // Increment the total number of items to drawn in this group
              total_to_draw_in_group += 1;

              // Add another row to draw every 'max_per_row' items or when we've reached the group's last row
              if ((total_to_draw_in_group % max_per_row) == 0 || (total_to_draw_in_group == collected)) {
                total_rows += 1;
              }
            }
          });
        }
      });

      // Proceed when at least one thing has been collected
      if (is_collected) {

        // Set dimension values of the canvas before we draw on it
        c_w = canvas[0].width = max_w * max_per_row;
        c_h = canvas[0].height = (max_h * total_rows);
        canvas.width(canvas[0].width);
        canvas.height(canvas[0].height);
        ctx = canvas[0].getContext("2d", {alpha: true});

        // Fill the canvas background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, c_w, c_h);

        // Draw the collection items to the canvas
        _.each(this.collection, function(group) {
          var
            collected       = _.filter(group.collection, function(am) {
              return am.collected;
            }).length;

          // Draw if one or more in group has been collected
          if (collected) {

            // Iterate over items in group
            _.each(group.collection, function(amiibo, amiibo_name) {
              if (amiibo.collected) {
                var
                  img       = $('.grid-item[data-amiibo-name="' + amiibo_name + '"] img')[0],
                  dx        = (max_w * items_drawn),
                  dy        = (max_h * rows_drawn);

                // Increment which item is being drawn in a given row
                items_drawn += 1;

                // Increment row being drawn
                if (items_drawn >= max_per_row) {
                  items_drawn = 0;
                  rows_drawn += 1;
                }

                // Draw the image
                ctx.drawImage(img, dx, dy, max_w, max_h);
              }
            });

            // Update number of rows drawn
            if (items_drawn > 0) rows_drawn += 1;
            items_drawn = 0;
          }
        });

        // Create image element from canvas and link wrapper and then add the image
        collection_img = new Image();
        collection_img.src = canvas[0].toDataURL("image/png");
        canvas.before($(collection_img).addClass('true-share-image'));
        canvas.hide();

        // Give download link source of new image
        $('.control-generate-share-image .info .message')
          .hide();
        $('.control-generate-share-image .info .download')
          .show()
          .find('a')
          .attr('href', collection_img.src);
      }

      // Display message if nothing has yet been collected
      else {
        container.find('.message').hide();
        container.find('.none').show();
      }
    },


    /**
     * Generates a JSON configuration file of a user's collection.
     */
    generateJSONConfig: function() {
      var
        container     = $('.control-generate-json-config'),
        json          = JSON.stringify(this.collection),
        file          = new Blob([json], {type: "text/plain"});

      // Revoke previously generated files to prevent memory leaks
      if (this.collection_configuration_file !== null) {
        window.URL.revokeObjectURL(this.collection_configuration_file);
      }

      // Create new collection configuration file
      this.collection_configuration_file = window.URL.createObjectURL(file);

      // Hide info message show download message
      container.find('.message').hide();
      container.find('.download').show().find('a').attr('href', this.collection_configuration_file).click();
    },


    /**
     * Handles the uploading and parsing of a user's configuration file.
     */
    uploadJSONConfig: function() {
      var
        self        = this,
        input       = $('.collection-configuration-input');

      // Trigger input click
      input.click();

      // Attach handling event once
      if (!input.data('event-attached')) {
        input.data('event-attached', true);
        input.change(function (e){
          var
            reader      = new FileReader(),
            input_elm   = input.get(0),
            text_file   = null;

          // Proceed when file selected
          if (input_elm.files.length) {
            text_file = input_elm.files[0];
            reader.readAsText(text_file);

            // Attach handler to process file
            $(reader).on('load', function(e) {
              var
                file        = e.target.result,
                config      = null;

              // Proceed if file exists
              if (file && file.length) {
                config = JSON.parse(file);

                // Load the new configuration file
                self.collection = config;
                if (self.storage_settings.is_local && !self.storage_settings.dont_use_local) {
                  window.localStorage.setItem(self.storage_settings.id, JSON.stringify(self.collection));
                }
                self.loadCollection();
                self.menus.share.close();
              }
            });
          }
        });
      }
    },





    //
    // !!!!!!!
    // @todo - Possibly refactor restart menu into own view
    // !!!!!!!
    //

    /**
     * Toggle and load the restart menu.
     */
    toggleRestartMenu: function() {

      // Add the modal menu
      if (!this.menus.restart) {
        this.menus.restart = $(this.templates.menuRestart()).remodal();
        this.$el.append(this.menus.restart);
      }

      // Toggle menu open/closed
      this.menus.restart.open();
    },


    /**
     * Handle restarting/resetting the collection to its default state.
     */
    handleCollectionRestart: function() {
      window.localStorage.removeItem(this.storage_settings.id);
      window.location.href = '/';
      this.menus.restart.close();
    },






    //
    // !!!!!!!
    // @todo - Possibly refactor below into own view
    // !!!!!!!
    //

    /**
     * Allows user to select/deselect an entire group at once.
     */
    toggleSelectedGroup: function(e) {
      var
        target        = $(e.currentTarget).closest('.amiibo-grid');

      // Stop click propagation from h2's events
      e.stopPropagation();

      // Iterate through groups selecting or unselecting items based on group data flag
      if (target.data('group-collected') == 'no' || !target.data('group-collected')) {
        target
          .addClass('group-collected')
          .find('.grid-item')
          .each(function(idx, item) {
            if (!$(item).hasClass('collected')) {
              $(item).click();
            }
          });
        target.data('group-collected', 'yes');
      }
      else if (target.data('group-collected') == 'yes') {
        target
          .removeClass('group-collected')
          .find('.grid-item')
          .each(function(idx, item) {
            if ($(item).hasClass('collected')) {
              $(item).click();
            }
          });
        target.data('group-collected', 'no');
      }
    },


    /**
     * Toggles a group open and closed.
     */
    toggleExpandGroup: function(e) {
      var
        target        = $(e.currentTarget),
        parent        = target.closest('.amiibo-grid'),
        group_name    = parent.attr('data-group-name'),
        group         = parent.find('.group');

      // Stop click propagation from h2's events
      e.stopPropagation();

      // Add indicator class to target
      parent.toggleClass('group-closed');

      // Switch icon in control and update collection object
      if (parent.hasClass('group-closed')) {
        this.collection[group_name].closed = true;
      } else {
        this.collection[group_name].closed = false;
      }

      // Update local storage
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
    },






    //
    // !!!!!!!
    // @todo - Refactor below collection item functionality into own view
    // !!!!!!!
    //

    /**
     * Toggle whether or not an item has been collected.
     */
    toggleSelectedItem: function(e) {
      var
        target                  = $(e.currentTarget),
        amiibo_group_container  = target.closest('.amiibo-grid'),
        amiibo_group            = amiibo_group_container .data('group-name'),
        amiibo_name             = target.data('amiibo-name');

      // Stop propagation so group isn't clicked
      e.stopPropagation();

      // Toggle the UI
      target.toggleClass('collected');

      // Update the collection object
      if (target.hasClass('collected')) {
        this.collection[amiibo_group].collection[amiibo_name].collected = true;
      } else {
        this.collection[amiibo_group].collection[amiibo_name].collected = false;
      }

      // Update the local storage object
      if (this.storage_settings.is_local && !this.storage_settings.dont_use_local) {
        window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
      }

      // Update the group stats
      target
        .closest('.amiibo-grid')
        .find('.group-stat-collected')
        .html(_.filter(this.collection[amiibo_group].collection, 'collected').length);

      // Add appropriate class on group
      if (_.size(this.collection[amiibo_group].collection) == _.filter(this.collection[amiibo_group].collection, 'collected').length) {
        amiibo_group_container
          .data('group-collected', 'yes')
          .addClass('group-collected');
      } else {
        amiibo_group_container
          .data('group-collected', 'no')
          .removeClass('group-collected');
      }
    },

    /**
     * Opens/initializes the settings modal for a given collection item.
     */
    toggleItemSettingsMenu: function(e) {
      var
        self        = this,
        target      = $(e.currentTarget),
        menu        = null,
        grid_item   = target.closest('.grid-item.collected'),
        group_name  = target.closest('.amiibo-grid').attr('data-group-name'),
        item_name   = target.closest('[data-amiibo-name]').attr('data-amiibo-name'),
        item_obj    = this.collection[group_name].collection[item_name],
        open_modal  = true;

      // Open settings menu only for collected items
      if (grid_item.length) {

        // Make sure further events aren't triggered
        e.stopPropagation();

        // Make sure the modal isn't already open
        if (this.menus.item_settings) {
          if (this.menus.item_settings.hasClass('remodal-is-opened')) {
            open_modal = false;
          }
        }

        // Continue if modal not already open
        if (open_modal) {

          // Re-populate the item settings menu
          this.menus.item_settings = $(this.templates.menuItemSettings({
            item_group: group_name,
            item_name: item_name,
            item_title: item_obj.title
          }));
          this.menus.item_settings.data('trigger_source', target);

          // Replace previously opened modal instance
          if (!$('.menu-item-settings').length) {
            this.$el.append(this.menus.item_settings);
          } else {
            $('.menu-item-settings').closest('.remodal-wrapper').replaceWith(this.menus.item_settings);
          }
        }

        // Update the menu reference
        menu = this.menus.item_settings;

        // Remove any previous sub items (for when modal menu is not being opened)
        menu.find('.sub-items-container').children().remove();

        // Add any existing sub items
        if (item_obj.subitems) {
          _.each(item_obj.subitems, function(subitem, idx) {
            var
              this_subitem_elm        = null,
              this_notepad            = null;
            menu.find('.sub-items-container').append((this_subitem_elm = $(self.templates.menuItemSettingsSubitem({
              sub_item_title: item_obj.title,
              sub_item_id: idx
            }))));
            if (subitem.favorite) {
              this_subitem_elm.find('.controls-item-favorite').hide();
              this_subitem_elm.find('.controls-item-favorite-selected').addClass('selected');
            } else {
              this_subitem_elm.find('.controls-item-favorite').show();
              this_subitem_elm.find('.controls-item-favorite-selected').removeClass('selected');
            }
            this_subitem_elm.find('.controls-item-status option[value="' + subitem.status + '"]').prop('selected', true);
            this_subitem_elm.find('.controls-item-condition option[value="' + subitem.condition + '"]').prop('selected', true);
            this_notepad = this_subitem_elm.find('.controls-item-note .notepad');
            this_notepad.html(subitem.note);
          });
        }

        // Modalize the menu if it isn't already open
        if (open_modal) {
          menu.remodal().open();
        }
      }
    },


    /**
     * Adds a new sub-item to an item.
     */
    itemSettingsAddSubitem: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        items_container = container.find('.sub-items-container'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        sub_item_elm    = null,
        item_obj        = this.collection[group_name].collection[item_name],
        sub_item        = {
          favorite: false,
          note: ''
        };

      // Attempt to access any saved sub items, otherwise create sub item array
      if (!item_obj.subitems) {
        item_obj.subitems = [];
      }

      // Append sub-item element to item's setting page
      sub_item_elm = $(this.templates.menuItemSettingsSubitem({
        sub_item_title: item_obj.title,
        sub_item_id: item_obj.subitems.length
      }));
      items_container.append(sub_item_elm);

      // Add sub item object properties
      sub_item.id = item_obj.subitems.length;
      sub_item.status = sub_item_elm.find('.controls-item-status option:selected').attr('value');
      sub_item.condition = sub_item_elm.find('.controls-item-condition option:selected').attr('value');

      // Add sub item to sub items array
      item_obj.subitems.push(sub_item);

      // Save to local storage
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
    },


    /**
     * Move a sub item up one.
     */
    itemSettingsUpSubitem: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        sub_item_elm    = target.closest('.item'),
        sub_item_id     = parseInt(sub_item_elm.attr('data-sub-item-id')),
        item_obj        = this.collection[group_name].collection[item_name];

      // Shift array element up one position
      if (sub_item_id > 0) {

        // Give the sub item before this sub item's current id
        item_obj.subitems[sub_item_id-1].id = sub_item_id;
        sub_item_elm.prev('.item').attr('data-sub-item-id', sub_item_id);

        // Update this sub item's current id
        item_obj.subitems[sub_item_id].id = sub_item_id-1;
        sub_item_elm.attr('data-sub-item-id', sub_item_id-1);

        // Shift the two items locations in the subitems array
        item_obj.subitems.splice(sub_item_id-1, 0, item_obj.subitems.splice(sub_item_id, 1)[0]);

        // Save to local storage
        window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));

        // Reload
        this.menus.item_settings.data('trigger_source').click();
      }
    },


    /**
     * Make selected sub item a favorite.
     */
    itemSettingsFavoriteSubitem: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        items_container = container.find('.sub-items-container'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        sub_item_elm    = target.closest('.item'),
        sub_item_id     = parseInt(sub_item_elm.attr('data-sub-item-id')),
        item_obj        = this.collection[group_name].collection[item_name];
      
      // Set the selected
      sub_item_elm.find('.controls-item-favorite').toggle();
      sub_item_elm.find('.controls-item-favorite-selected').toggleClass('selected');

      // Save in local storage
      item_obj.subitems[sub_item_id].favorite = sub_item_elm.find('.controls-item-favorite-selected').hasClass('selected');
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
    },


    /**
     * Removes a collection item's sub-item.
     */
    itemSettingsRemoveSubitem: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        sub_item_elm    = target.closest('.item'),
        sub_item_id     = parseInt(sub_item_elm.attr('data-sub-item-id')),
        item_obj        = this.collection[group_name].collection[item_name];

      // Remove from local storage
      item_obj.subitems = _.without(item_obj.subitems, _.findWhere(item_obj.subitems, {
        id: sub_item_id
      }));
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));

      // Remove sub-item element from item's setting page
      sub_item_elm.remove();
    },


    /**
     * Updates a collection item's sub-item's "status".
     */
    itemSettingsSubitemStatusUpdate: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        sub_item_elm    = target.closest('.item'),
        sub_item_id     = sub_item_elm.attr('data-sub-item-id'),
        item_obj        = this.collection[group_name].collection[item_name],
        selected        = target.find('option:selected');

      // Update local storage
      item_obj.subitems[sub_item_id].status = selected.attr("value");
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
    },


    /**
     * Updates a collection item's sub-item's "condition".
     */
    itemSettingsSubitemConditionUpdate: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        sub_item_elm    = target.closest('.item'),
        sub_item_id     = sub_item_elm.attr('data-sub-item-id'),
        item_obj        = this.collection[group_name].collection[item_name],
        selected        = target.find('option:selected');

      // Update local storage
      item_obj.subitems[sub_item_id].condition = selected.attr("value");
      window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
    },


    /**
     * "Activates" a collection item's sub-item's notepad area by preparing it for a user to write a note.
     */
    itemSettingsSubitemNoteToggle: function(e) {
      var
        target          = $(e.currentTarget),
        container       = target.closest('.menu-item-settings'),
        group_name      = container.attr('data-item-group'),
        item_name       = container.attr('data-item-name'),
        control         = target.closest('.controls-item-note'),
        sub_item_elm    = target.closest('.item'),
        sub_item_id     = sub_item_elm.attr('data-sub-item-id'),
        item_obj        = this.collection[group_name].collection[item_name],
        notepad         = control.find('.notepad'),
        note            = notepad.html().replace('<br>', '');

      // Continue when the active sequence wasn't activated by a click into the notepad
      if (!(notepad.hasClass('active') && target.hasClass('notepad'))) {

        // Add active class
        notepad.toggleClass('active');

        // Update control wording based on active status
        if (notepad.hasClass('active')) {
          control.find('.input-cell .button').html('Save Note');
        } else {
          control.find('.input-cell .button').html('Edit Note');
        }

        // Update local storage
        item_obj.subitems[sub_item_id].note = note;
        window.localStorage.setItem(this.storage_settings.id, JSON.stringify(this.collection));
      }
    }

  });

  return Main;
});
