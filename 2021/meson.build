project('aoc', 'c')

src = [
	'src/aoc.c',
	'src/01.c',
	'src/02.c',
	'src/03.c',
	'src/04.c',
	'src/05.c',
	'src/06.c',
	'src/07.c',
	'src/08.c',
	'src/09.c',
	'src/10.c',
	'src/11.c',
	'src/12.c',
	'src/13.c'
]

deps = [
	subproject('c-hashmap').get_variable('main_dep'),
	subproject('c-vector').get_variable('main_dep'),
	subproject('getopt').get_variable('main_dep'),
	subproject('sds').get_variable('main_dep')
]

inc = include_directories('include')

args = [
	'-DINPUT_PATH="' + meson.source_root() + '/"'
]

executable('aoc', src, dependencies: deps, include_directories: inc, c_args: args)
